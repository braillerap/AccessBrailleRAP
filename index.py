# coding: utf-8
import eel
import sys
import serial.tools.list_ports
import time
import json
import platform

class SerialStatus :
    Ready = 0
    Busy = 2

serial_port = None
serial_status = SerialStatus.Ready

app_options = {
    'comport':'COM1',
    'nbcol':28,
    'nbline':21,
}

def remove_comment(string):
    """Remove comments from GCode if any"""
    if string.find(';') == -1:
        return string
    return string[:string.index(';')]
 
 
def file_len(fname):
    """Counts lines in GCode source file"""
    counter = None
    with open(fname) as file:
        for counter, value in enumerate(file):
            pass
    return counter + 1

def save_parameters ():
    """Save parameters in local json file"""
    try:
        
        print ("data", app_options)
        print ("json", json.dumps(app_options))
        with open ('parameters.json', 'w', encoding='utf-8') as of:
            json.dump(app_options, of)

    except Exception as e: 
        print(e)
            
    

def load_parameters ():
    try:
        with open ('parameters.json', 'r', encoding='utf-8') as inf:
            data = json.load(inf)
            for k,v in data.items():
                if k in app_options:
                    app_options[k] = v
    
    except Exception as e: 
        print(e)

@eel.expose
def gcode_set_parameters (opt):
    print ("parameters", opt, type(opt))
    try:
        for k,v in opt.items():
            if (k in app_options):
                app_options[k] = v

    except Exception as e:
        print (e)            
    save_parameters ()

@eel.expose
def gcode_get_parameters ():
    js = json.dumps (app_options)
    return js

@eel.expose
def printer_get_status ():
    return serial_status

@eel.expose
def PrintGcode (gcode, comport):
    global serial_status
    print('Opening Serial Port', comport)
    try:
        serial_status = SerialStatus.Busy
        with serial.Serial(comport, 250000, timeout=2, write_timeout=2) as Printer:
            print(comport, 'is open')
            
            
            print('fin test js')

            # Hit enter a few times to wake up
            Printer.write(str.encode("\r\n\r\n"))
            print(comport, 'cleanup')
            eel.sleep(2)  # Wait for initialization
            Printer.flushInput()  # Flush startup text in serial input
            print('Sending GCode')
            gcodelines = gcode.split ("\r\n")
            for line in gcodelines:
                cmd_gcode = remove_comment(line)
                cmd_gcode = cmd_gcode.strip()  # Strip all EOL characters for streaming
                if (cmd_gcode.isspace() is False and len(cmd_gcode) > 0):
                    print('Sending: ' + cmd_gcode)
                    Printer.write(cmd_gcode.encode() +
                                            str.encode('\n'))  # Send g-code block
                    # Wait for response with carriage return
                    while True:
                        grbl_out = Printer.readline()
                        print(grbl_out.strip().decode("utf-8"))
                        if str.encode("ok") in grbl_out:
                            break
            print ('End of printing')
            Printer.close ();
    except Exception as e:
        print (e)
       
        
    serial_status = SerialStatus.Ready

@eel.expose
def hello():
    for i in range (10):
        print('hello', i)

@eel.expose
def gcode_set_serial (serial):
    serial_port = serial

@eel.expose
def gcode_set_com_port (port):
    
    app_options['comport'] = str(port)
    save_parameters()

@eel.expose
def gcode_set_nb_line (nbline):
    
    app_options['nbline'] = int(nbline)
    save_parameters()

@eel.expose
def gcode_set_nb_col (nbcol):
    
    app_options['nbcol'] = int(nbcol)
    json.dump()

@eel.expose
def gcode_get_serial ():
    data = []
    try:
        ports = serial.tools.list_ports.comports()
        for port in ports:
            print (port.device)
            print (port.hwid)
            print (port.name)
            print (port.description)
            print (port.product)
            print (port.manufacturer)
            data.append ({'device':port.device, 'description':port.description, 'name':port.name, 'product':port.product, 'manufacturer':port.manufacturer})
        print(data)
    except Exception as e:
        print (e)

    js = json.dumps(data)
    
    return js

if __name__ == '__main__':
    devel = False

    load_parameters ()
    print (app_options)
    

    if len(sys.argv) > 1:
        if sys.argv[1] == '--develop':
            eel.init('client')
            
            eel.start({"port": 3000}, host="localhost", port=8888)
            
            devel = True

    if devel == False:
        eel.init('build')
        try:
            print ("start edge")
            
            eel.start('index.html', host="localhost", port=8888)
            
        except EnvironmentError:
            if sys.platform in ['win32', 'win64'] and int(platform.release()) >= 10:
                print ("start chrome")
                eel.start('index.html', host="localhost", port=8888, mode='edge')
                    
            else:
                raise                

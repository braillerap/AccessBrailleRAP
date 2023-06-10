# coding: utf-8
import eel
import sys
import serial.tools.list_ports
import time
import json
import platform
import sys
import zipfile
import tkinter as tk
import tkinter.filedialog 
import pypandoc

class SerialStatus :
    Ready = 0
    Busy = 2

serial_port = None
serial_status = SerialStatus.Ready

app_options = {
    'comport':'COM1',
    'nbcol':27,
    'nbline':20,
    'brailletbl':70,
    'lang':''
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
def import_pandoc():
    js =""
    root = tk.Tk()
    
    fname = tkinter.filedialog.askopenfilename(title = "Select file",filetypes = (("all files","*.*"),))
    #print ("fname", fname)
    root.destroy()
    if fname != "":
         
        linel = int (app_options['nbcol'])-1
        
        data = pypandoc.convert_file(fname, "plain+simple_tables", extra_args=(), encoding='utf-8', outputfile=None)
        #print (data)
        js = json.dumps(data)
    
    return js

@eel.expose
def PrintGcode (gcode, comport):
    global serial_status
    print('Opening Serial Port', comport)
    try:
        if serial_status == SerialStatus.Busy:
            print ("Printer busy")
            return ("Print in progress :")
        
        serial_status = SerialStatus.Busy
        with serial.Serial(comport, 250000, timeout=2, write_timeout=2) as Printer:
            print(comport, 'is open')

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
                    tbegin = time.time()
                    while True:
                        grbl_out = Printer.readline()
                        print(grbl_out.strip().decode("utf-8"))
                        if str.encode("ok") in grbl_out:
                            break
                        if len(grbl_out) > 0:
                            tbegin = time.time ()
                        if time.time() - tbegin > 5:
                            raise Exception("Timeout in printer communication")

            print ('End of printing')
            Printer.close ();
    except Exception as e:
        print (e)
        serial_status = SerialStatus.Ready   
        return ("Erreur d'impression :" + str(e))
    
        
    serial_status = SerialStatus.Ready
    return (" ")

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

    #check if com port in parameters is present in port enumeration
    if not any(d.get('device', "???") == app_options['comport'] for d in data):
        print ("adding com port in parameters")
        data.append ({'device':app_options['comport'], 'description':'inconnu', 'name':'inconnu', 'product':'inconnu', 'manufacturer':'inconnu'})

    # dump data in json format for frontend
    js = json.dumps(data)
    
    return js

"""
def single_instance():
    mutexname = 'Global\\' + sys.argv[0]
    mutex = win32event.CreateMutex(None, 1, mutexname)
    lasterror = win32api.GetLastError()
    print (lasterror)
    if lasterror != 0:
        sys.exit("Une autre instance de ce programme est déjà en cours d'exécution.")
"""        

if __name__ == '__main__':
    devel = False
    
    #single_instance ()

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
            print ("start chrome")
            
            eel.start('index.html', host="localhost", port=8888)
            
        except EnvironmentError:
            if sys.platform in ['win32', 'win64'] and int(platform.release()) >= 10:
                print ("start edge")
                eel.start('index.html', host="localhost", port=8888, mode='edge')
                    
            else:
                raise                

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
import tkinter.messagebox
import pypandoc
import os
import webbrowser

if getattr(sys, 'frozen', False):
    try:    #pyi_splash only available while running in pyinstaller
        import pyi_splash
    except ImportError:
        pass

class SerialStatus :
    Ready = 0
    Busy = 2

serial_port = None
serial_status = SerialStatus.Ready
filename = ""

app_options = {
    'comport':'COM1',
    'nbcol':27,
    'nbline':20,
    'brailletbl':70,
    'lang':''
}

def is_chrome_intalled ():
    import winreg as reg
    reg_path = r'SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe'
    chrome_path = None
    for install_type in reg.HKEY_CURRENT_USER, reg.HKEY_LOCAL_MACHINE:
        try:
            reg_key = reg.OpenKey(install_type, reg_path, 0, reg.KEY_READ)
            chrome_path = reg.QueryValue(reg_key, None)
            reg_key.Close()
            if not os.path.isfile(chrome_path):
                continue
            print (chrome_path)
        except WindowsError:
            chrome_path = None
        else:
            break
    
    return os.path.isfile(chrome_path)

def check_chrome ():
    if not is_chrome_intalled():
        tk.messagebox.showerror("Error", message="Unable to find Chrome. Please install chrome to use AccessBrailleRAP");
        
        url = "https://www.google.com/chrome"
        webbrowser.open(url, new=0, autoraise=True)
        
        return False
    return True

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
def saveas_file(data, dialogtitle, filterstring):
    global filename
    
    root = tk.Tk()
    root.geometry("1x1+4096+4096")
    fname = tkinter.filedialog.asksaveasfilename(title = "Select file",filetypes = (("Text files", "*.txt"),("All files", "*.*")))
    root.destroy()
    if fname =="":
        return
    filename = fname
    

    with open(filename, "w", encoding='utf8') as inf:
        inf.writelines(data)
        

@eel.expose 
def save_file(data):
    global filename
    if filename == "":
        root = tk.Tk()
        root.geometry("1x1+4096+4096")
        fname = tkinter.filedialog.asksaveasfilename(title = "Select file",filetypes = (("Text files", "*.txt"),("All files", "*.*")))
        root.destroy()
        
        if fname =="":
            return
        filename = fname
        

    with open(filename, "w", encoding='utf8') as inf:
        print (data)
        inf.writelines(data)
        
    
    

@eel.expose 
def load_file(dialogtitle, filterstring):
    global filename
    js ={
        "data":"",
        "error":""
         }
    root = tk.Tk()
    root.geometry("1x1+4096+4096")

    print (filterstring)
    print (type(filterstring))
    if len(filterstring) < 2:
        js["error"] = "incorrect file filter"
        return json.dumps(js)
    
    oldfilter = (("Text files", "*.txt"),("All files", "*.*"))
    filter = ((filterstring[0], "*.txt"),(filterstring[1], "*.*"))
    fname = tkinter.filedialog.askopenfilename(title = dialogtitle,filetypes = filter)
    #fname = tkinter.filedialog.askopenfilename(title = "Select file",filetypes = (("Text files", "*.txt"),("All files", "*.*") ))
    #print ("fname", fname)
    root.destroy()
    if fname == "":
        return json.dumps(js)
    with open(fname, "rt", encoding='utf8') as inf:
        js["data"] = inf.read()
        filename = fname
    
    return json.dumps(js)

@eel.expose 
def import_pandoc(dialogtitle, filterstring):
    global filename
    js ={
        "data":"",
        "error":""
         }
    root = tk.Tk()
    root.geometry("1x1+4096+4096")
    filter = ((filterstring[0], "*.*"),)
    fname = tkinter.filedialog.askopenfilename(title = dialogtitle,filetypes = filter)
    
    #print ("fname", fname)
    root.destroy()
    if fname != "":
        filename = ""
        try:
            js["data"] = pypandoc.convert_file(fname, "plain+simple_tables", extra_args=(), encoding='utf-8', outputfile=None)
            #print (data)
        except Exception as e:
            js["error"] = str(e)
        
        
    
    return json.dumps(js)

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


if __name__ == '__main__':
    devel = False
    
    print ("App start")
    if not check_chrome ():
        exit (-1)
    
    #single_instance ()

    load_parameters ()
    #print (app_options)

    

    if len(sys.argv) > 1:
        if sys.argv[1] == '--develop':
            eel.init('client')
            
            try:
                pyi_splash.close ()
            except:
                pass    
            
            eel.start({"port": 3000}, host="localhost", port=8888)
            
            devel = True

    if devel == False:
        eel.init('build')
        
        try:
            pyi_splash.close ()
        except:
            pass
        
        try:
            print ("start chrome")
            
            eel.start('index.html', host="localhost", port=8888)
            
        except EnvironmentError:
            if sys.platform in ['win32', 'win64'] and int(platform.release()) >= 10:
                print ("start edge")
                eel.start('index.html', host="localhost", port=8888, mode='edge')
                    
            else:
                raise                

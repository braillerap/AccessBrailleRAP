!include MUI2.nsh

; AccessBrailleRAP.nsi
;
; This script is based on example1.nsi, but it remember the directory, 
; has uninstall support and (optionally) installs start menu shortcuts.
;
; It will install example2.nsi into a directory that the user selects.
;
; See install-shared.nsi for a more robust way of checking for administrator rights.
; See install-per-user.nsi for a file association example.

;--------------------------------

; The name of the installer
Name "AccessBrailleRAP"

; The file to write
OutFile "AccessBrailleRAPSetup.exe"

; Request application privileges for Windows Vista and higher
RequestExecutionLevel admin

; Build Unicode installer
Unicode True

; The default installation directory
InstallDir $PROGRAMFILES\AccessBrailleRAP

; Registry key to check for directory (so if you install again, it will 
; overwrite the old one automatically)
InstallDirRegKey HKLM "Software\AccessBrailleRAP" "Install_Dir"

;--------------------------------

; Pages

Page components
Page directory
Page instfiles

UninstPage uninstConfirm
UninstPage instfiles

;--------------------------------

; The stuff to install
Section "AcessBrailleRAP (required)"

  SectionIn RO
  
  ; Set output path to the installation directory.
  SetOutPath $INSTDIR
  
  ; Put file there
  File "AccessBrailleRAP.exe"
  File "parameters.json"
  ; pandoc
  File "pandoc.exe"
  
  ; drivers
  File "CDM212364_Setup.exe"
  File "CH341SER.EXE"

   AccessControl::GrantOnFile \
    "$INSTDIR\parameters.json" "(BU)" "GenericRead + GenericWrite"
    Pop $0 ; "error" on errors

  ; Write the installation path into the registry
  WriteRegStr HKLM SOFTWARE\AccessBrailleRAP "Install_Dir" "$INSTDIR"
  
  ; Write the uninstall keys for Windows
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AccessBrailleRAP" "DisplayName" "AccessBrailleRAP"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AccessBrailleRAP" "UninstallString" '"$INSTDIR\uninstall.exe"'
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AccessBrailleRAP" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AccessBrailleRAP" "NoRepair" 1
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
  ExecWait '"$INSTDIR\CDM212364_Setup.exe"'
  ExecWait '"$INSTDIR\CH341SER.exe"'

SectionEnd

; Optional section (can be disabled by the user)
Section "Start Menu Shortcuts"

  CreateDirectory "$SMPROGRAMS\AccessBrailleRAP"
  CreateShortcut "$SMPROGRAMS\AccessBrailleRAP\Uninstall.lnk" "$INSTDIR\uninstall.exe"
  CreateShortcut "$SMPROGRAMS\AccessBrailleRAP\AccessBrailleRAP.lnk" "$INSTDIR\AccessBrailleRAP.exe"

SectionEnd

;--------------------------------

; Uninstaller

Section "Uninstall"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\AccessBrailleRAP"
  DeleteRegKey HKLM SOFTWARE\AccessBrailleRAP

  ; Remove files and uninstaller
  Delete $INSTDIR\AccessBrailleRAP.exe
  Delete $INSTDIR\parameters.json
  Delete $INSTDIR\uninstall.exe
  Delete $INSTDIR\CDM212364_Setup.exe
  Delete $INSTDIR\CH341SER.EXE

  ; Remove shortcuts, if any
  Delete "$SMPROGRAMS\AccessBrailleRAP\*.lnk"

  ; Remove directories
  RMDir "$SMPROGRAMS\AccessBrailleRAP"
  RMDir "$INSTDIR"

SectionEnd

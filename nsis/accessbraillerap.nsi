!include "MUI2.nsh"





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

; Build Unicode installer
Unicode True

; The default installation directory
InstallDir $PROGRAMFILES\AccessBrailleRAP

; Request application privileges for Windows Vista and higher
RequestExecutionLevel admin

; Registry key to check for directory (so if you install again, it will 
; overwrite the old one automatically)
InstallDirRegKey HKLM "Software\AccessBrailleRAP" "Install_Dir"

;--------------------------------
; Pages configuration
;!define MUI_HEADERIMAGE 1
;!define MUI_HEADERIMAGE_BITMAP "InstallerLogo.bmp"
;!define MUI_BRANDING
;!define MUI_BRANDING_BITMAP "InstallerLogo.bmp"
;!define MUI_HEADERIMAGE_RIGHT
!define MUI_ICON "brap.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\win.bmp" ; optional
;!define MUI_ABORTWARNING


; Pages
!insertmacro MUI_PAGE_WELCOME
;!insertmacro MUI_PAGE_LICENSE "${NSISDIR}\Docs\Modern UI\License.txt"
;!insertmacro MUI_PAGE_LICENSE "${NSISDIR}\Docs\Modern UI\License.txt"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
  
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"
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
  
  
SectionEnd

Section "USB Drivers"
  
  ; drivers
  File "CDM212364_Setup.exe"
  File "CH341SER.EXE"

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
;Descriptions

  ;Language strings
  LangString DESC_SecDummy ${LANG_ENGLISH} "A test section."

  ;Assign language strings to sections
  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
    !insertmacro MUI_DESCRIPTION_TEXT ${SecDummy} $(DESC_SecDummy)
  !insertmacro MUI_FUNCTION_DESCRIPTION_END

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

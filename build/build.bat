@ECHO OFF
fltmc >nul 2>&1 && (
    cd /D "%~dp0"
    ECHO ************************************************ >> built.log
    ECHO RequireJS Build Script started.
    ECHO RequireJS Build Script started. >> built.log
    ECHO ************************************************ >> built.log
    ECHO Building \custom.css
    ECHO Building \custom.css >> built.log
    node "%AppData%\npm\node_modules\requirejs\bin\r.js" -o build-customCSS.js >> built.log
    ECHO ************************************************ >> built.log
    ECHO Building \CustomSpace\Scripts\taks\gridTaskMain.js
    ECHO Building \CustomSpace\Scripts\tasks\gridTaskMain.js >> built.log
    node "%AppData%\npm\node_modules\requirejs\bin\r.js" -o build-gridTaskMain.js >> built.log
    ECHO ************************************************ >> built.log
    ECHO RequireJS Build Script completed.
    ECHO RequireJS Build Script completed. >> built.log
) || (
    ECHO ************************************************
    ECHO Failure: Current permissions inadequate. Please rerun in elevated prompt.
)
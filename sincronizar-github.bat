@echo off
setlocal enabledelayedexpansion
title Sincronizacion CMR con GitHub
color 0b

echo.
echo =============================================================
echo   Creative Maximum Reasoning - Sincronizador a GitHub
echo =============================================================
echo.

:: 1. Deteccion inteligente de la ruta del repositorio
set "REPO_DIR="
if exist "%~dp0.git" (
    set "REPO_DIR=%~dp0"
) else if exist "%~dp0CMR-Pagina Principal\cmr-website\.git" (
    set "REPO_DIR=%~dp0CMR-Pagina Principal\cmr-website"
) else if exist "CMR-Pagina Principal\cmr-website\.git" (
    set "REPO_DIR=%CD%\CMR-Pagina Principal\cmr-website"
)

if "%REPO_DIR%"=="" (
    color 0c
    echo [ERROR] No se encontro la carpeta .git del repositorio.
    echo Buscado en:
    echo   - %~dp0
    echo   - %~dp0CMR-Pagina Principal\cmr-website
    echo.
    pause
    exit /b 1
)

cd /d "%REPO_DIR%"
echo [OK] Repositorio detectado en:
echo      "%REPO_DIR%"
echo.

:: 2. Auto-recuperacion de bloqueos y estados colgados previos
if exist ".git\index.lock" (
    echo [RECUPERACION] Se detecto index.lock colgado. Eliminando bloqueo...
    del /f /q ".git\index.lock" >nul 2>&1
)
if exist ".git\rebase-apply" (
    echo [RECUPERACION] Abortando rebase previo...
    git rebase --abort >nul 2>&1
)
if exist ".git\rebase-merge" (
    echo [RECUPERACION] Abortando rebase previo...
    git rebase --abort >nul 2>&1
)
if exist ".git\MERGE_HEAD" (
    echo [RECUPERACION] Abortando merge previo...
    git merge --abort >nul 2>&1
)

:: 3. Preparacion de cambios locales (nuevos, modificados y borrados)
echo [1/4] Registrando archivos creados, modificados o eliminados...
git add -A .

:: 4. Deteccion de cambios pendientes
set "HAY_CAMBIOS="
for /f "tokens=*" %%i in ('git status --porcelain') do (
    set "HAY_CAMBIOS=1"
    goto :cambios_detectados
)
:cambios_detectados

if defined HAY_CAMBIOS (
    set "HORA=%time: =0%"
    set "TIMESTAMP=%date% !HORA:~0,5!"
    echo [2/4] Creando commit local con cambios detectados...
    git commit -m "sync: actualizacion automatica de archivos y carpetas [!TIMESTAMP!]"
    if errorlevel 1 (
        echo [AVISO] El commit reporto una advertencia, continuando sincronizacion...
    )
) else (
    echo [2/4] No hay cambios locales nuevos para commitear.
)

:: 5. Descarga y sincronizacion con GitHub
echo.
echo [3/4] Sincronizando con repositorio remoto git pull...
git pull origin main --rebase
if errorlevel 1 (
    echo [AVISO] Rebase con advertencia. Aplicando merge seguro...
    git rebase --abort >nul 2>&1
    git pull origin main --no-rebase -m "merge: sincronizar cambios remotos con GitHub"
)

:: 6. Subida final a GitHub
echo.
echo [4/4] Subiendo cambios a GitHub git push...
git push origin main
if errorlevel 1 (
    echo [REINTENTO] Intentando fijar upstream git push -u origin main...
    git push -u origin main
)

if errorlevel 1 (
    color 0c
    echo.
    echo =============================================================
    echo   [ERROR] No se pudo completar el push a GitHub.
    echo   Verifica tu conexion a internet o tus credenciales de Git.
    echo =============================================================
    echo.
    echo Presiona cualquier tecla para cerrar esta ventana...
    pause > nul
) else (
    color 0a
    echo.
    echo =============================================================
    echo   EXITO TOTAL: Todo sincronizado correctamente con GitHub!
    echo =============================================================
    echo.
    echo Cerrando automaticamente en 3 segundos (o presiona cualquier tecla)...
    timeout /t 3 > nul 2>&1 || ping 127.0.0.1 -n 4 > nul
)


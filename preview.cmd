@echo off
setlocal
cd /d "%~dp0"
set "BUNDLE_GEMFILE=%~dp0_preview\Gemfile"
set "JEKYLL_ENV=development"

where ruby >nul 2>nul
if errorlevel 1 goto missing_ruby
where bundle >nul 2>nul
if errorlevel 1 goto missing_bundle

echo Checking local preview dependencies...
call bundle check >nul 2>nul
if errorlevel 1 (
    call bundle install
    if errorlevel 1 goto failed
)

echo.
echo Local preview: http://127.0.0.1:4000
echo Save your files to rebuild and refresh the browser automatically.
echo Keep this window open. Press Ctrl+C to stop.
echo If you edit _config.yml, stop and start this script again.
echo.
call bundle exec jekyll serve --source "%~dp0." --host 127.0.0.1 --port 4000 --livereload --force_polling --open-url
if errorlevel 1 goto failed
exit /b 0

:missing_ruby
echo Ruby is missing. Install Ruby+Devkit from https://rubyinstaller.org/
goto failed

:missing_bundle
echo Bundler is missing. Run: gem install bundler
goto failed

:failed
echo.
echo Preview could not start. Check the error above.
pause
exit /b 1

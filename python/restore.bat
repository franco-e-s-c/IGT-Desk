@echo off
SET PG_BIN="C:\Program Files\PostgreSQL\13\bin\pg_dump.exe"
SET PG_HOST=localhost
SET PG_PORT=5433
SET PG_DATABASE=igt_db
SET PG_USER=igtuser
SET PGPASSWORD=igtAdmin
@REM SET PG_PORT=5432
@REM SET PG_DATABASE=igtManuelServer
@REM SET PG_USER=postgres
@REM SET PGPASSWORD=admin
SET PG_PATH=%~dp0
SET FECHAYHORA=%date:/=%-%time:-0,8%
SET FECHAYHORA=%FECHAYHORA::=-%
SET FECHAYHORA=%FECHAYHORA: =0%
SET PG_FILENAME=restore.sql
%PG_BIN% -Fc -a -t public.participante --inserts --on-conflict-do-nothing -t public.encuesta --inserts --on-conflict-do-nothing -h %PG_HOST% -w -p %PG_PORT% -U %PG_USER% %PG_DATABASE% > %PG_FILENAME%
@echo off
SET PG_BIN="C:\Program Files\PostgreSQL\13\bin\pg_restore.exe"
SET PG_HOST=localhost
SET PG_PORT=5432
SET PG_DATABASE=igt
SET PG_USER=postgres
SET PGPASSWORD=admin
@REM SET PG_PORT=5432
@REM SET PG_DATABASE=igtManuel
@REM SET PG_USER=postgres
@REM SET PGPASSWORD=admin
%PG_BIN% -v --no-owner -h %PG_HOST% -p %PG_PORT% -U %PG_USER% -d %PG_DATABASE% -F c restore.sql
pause
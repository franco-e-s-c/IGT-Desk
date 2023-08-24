@echo off
SET PG_BIN="C:\Program Files\PostgreSQL\13\bin\pg_dump.exe"
SET PG_HOST=localhost
SET PG_PORT=5432
SET PG_DATABASE=igt
SET PG_USER=postgres
SET PGPASSWORD=admin
SET PG_PATH=%~dp0
SET FECHAYHORA=%date:/=%-%time:-0,8%
SET FECHAYHORA=%FECHAYHORA::=-%
SET FECHAYHORA=%FECHAYHORA: =0%
SET PG_FILENAME=squema2.sql
%PG_BIN% -Fc -a -h %PG_HOST% -w -p %PG_PORT% -U %PG_USER% %PG_DATABASE% > %PG_FILENAME%
@echo off
SET PG_BIN="C:\Program Files\PostgreSQL\13\bin\psql.exe"
SET PG_HOST=localhost
SET PG_PORT=5433
SET PG_DATABASE=igt_db
SET PG_USER=igtuser
SET PGPASSWORD=igtAdmin
SET PG_PATH=%~dp0
SET FECHAYHORA=%date:/=%-%time:-0,8%
SET FECHAYHORA=%FECHAYHORA::=-%
SET FECHAYHORA=%FECHAYHORA: =0%
SET PG_FILENAME=squema2.sql
(
echo DELETE FROM encuesta;
echo DELETE FROM gsr;
echo DELETE FROM resultado;
echo DELETE FROM experimento;
echo DELETE FROM participante;
echo DELETE FROM configuracion;
echo DELETE FROM aplicador;
) | %PG_BIN% -h %PG_HOST% -w -p %PG_PORT% -U %PG_USER% -d %PG_DATABASE%
@echo off
SET PG_BIN="C:\Program Files\PostgreSQL\13\bin\pg_restore.exe"
SET PG_HOST=localhost
SET PG_PORT=5433
SET PG_DATABASE=igt_db
SET PG_USER=igtuser
SET PGPASSWORD=igtAdmin
%PG_BIN% -v --no-owner -h %PG_HOST% -p %PG_PORT% -U %PG_USER% -d %PG_DATABASE% -F c squema2.sql

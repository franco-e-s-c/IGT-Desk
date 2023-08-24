import subprocess
import os
path = os.getcwd()
path = path + '''\\resources\\app\\python\\restore.bat'''
# path = path + '''\\python\\restore.bat'''
p = subprocess.run([path], capture_output=True)
print(p.returncode)
print(p.stderr.decode(encoding='UTF-8',errors='ignore'))
#print(p.stdout.decode())

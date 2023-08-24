import subprocess
import os
path = os.getcwd()
path = path + '''\\resources\\app\\python\\backActu.bat'''
# path = path + '''\\python\\backActu.bat'''
p = subprocess.run([path], capture_output=True)
print(p.returncode)
print(p.stderr.decode(encoding='UTF-8',errors='ignore'))
#print(p.stdout.decode())

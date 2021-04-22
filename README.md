## **Carpark Status Monitor**

This web app gives a guide for identifying appropriate car parks to users 
owning cars within and around Nairobi. The essence is to have a systthat 
saves users time when identifying an available carpark in town and suitable 
in other respects too, e.g. distance from the users work place, price 
preference, carpark owner amongst other parameters.


Being a web app that seeks database functionalities and other dynamic functionalities e.g. real-time update of carpark occupancy status, it is developed on Django web framework, which is 100% python. Django was particularly useful for the development of this app because it can efficiently integrate GIS capabilities derived from both GDALOGR python packages and PostGIS spatial functions.


From the Geodjango documentation, “Geodjango intends to be a world-class geographic Web framework. Its goal is to make it as easy as possible to build GIS Web applications and harness the power of spatially enabled data.”

## Accessing the code:

The code to this work is uploaded in GitHub in this repository address. It can be downloaded from the specified URL as a zip file or cloned using git. With your command prompt or PowerShell in your directory of choice, you can download the project with the command:

```bash
git clone --depth 1 https://github.com/Wokiri/Carpark-Monitor.git
```



Download python, either of the following versions **3.6, 3.7, 3.8** for use with **Django version 3.1** which we shall use. I personally used python 3.8.6 which can be downloaded [here](https://www.python.org/downloads/release/python-386/).



## Make a python virtual environment:

A virtual environment has its own Python binary (which matches the version of the binary that was used to create this environment) and can have its own independent set of installed Python packages in its site directories. This is important due to the fact that the installed packages for each virtual environment don’t interfere with each other, or, it prevents installed packages from affecting system services and other users of the machine.
With your command prompt or PowerShell in your directory of choice, a virtual environment can then be created by running:

```bash
C:\Python38\python.exe -m venv parkvenv
```

NB: This will work only if python is located in the address C:\Python38. If your python 3 isn’t residing in that path, just identify it and replace C:\Python38 with it.


### Activate python environment

```bash
.\parkvenv\Scripts\activate
```

### Download django

```bash
python -m pip install Django==3.1.4
```

### Download psycopg2
Psycopg is the most popular PostgreSQL database adapter for the Python programming language. Psycopg 2 is both Unicode and Python 3 friendly.

```bash
python -m pip install psycopg2==2.8.6
```

Download Python gdal library. Please do!
Visit https://www.lfd.uci.edu/~gohlke/pythonlibs/#gdal

From amongst the wide array of options, you want to chose a gdal version matching the python version used to make and activate your virtual environment, e.g for python 3.8 (as in my case) you download one with cp38 i.e. GDAL-3.1.4-cp38-cp38-win_amd64; for python 3.7, download one with cp37 i.e. GDAL-3.1.4-cp37-cp37m-win_amd64; and so on and so forth.
Put the downloaded gdal python wheel file in your working folder, then install it with:

```bash
python -m pip install GDAL-3.1.4-cp38-cp38-win_amd64.whl
```

If successful, you can at this point confirm that gdal can be accessed by the python environment. In the powershell, type:


```bash
python
```

An active python shell will be open, try importing the packages:

```
(venv386) PS D:\Dev> py
Python 3.8.6 (tags/v3.8.6:db45529, Sep 23 2020, 15:52:53) [MSC v.1927 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import ogr
>>> import gdal
>>>
```

If no errors are raised, we are good.
Exit the shell by typing ```exit()```
Get into the Carpark-Monitor directory by typing:

```bash
cd carpark-monitor
```


### Create a database:
In the settings.py file found inside carpark directory, you will see we specified the PostGIS database called carpark. We should create it. While still inside this file, modify the password part by replacing the **os.environ.get('DB_PASSWORD')**, with **“your-postgres-password”**

Create the database. In PowerShell, type:

```bash
psql -U postgres
```

When the authorization is successful, go ahead and type:

```bash
CREATE DATABASE “carpark”;
```

If the creation is successful, we can now prepare and link the project with the database. Type exit to leave the psql shell.
Then create a migration:

```bash
py manage.py migrate
```

Various tables e.g. auth, amongst others will at this point be created in the database.
Then make a migration, to create both Carpark and SpecialAddresses tables:

```bash
py manage.py makemigrations
```


```OPTIONAL STEP:```
You can confirm the sql that will create these tables by typing:
```py manage.py sqlmigrate parking_app 0001```

Effect the changes by running another migration:

```bash
py manage.py migrate
```


Your project is now ready. BUT, populate the database with the carpark data first.

```bash
py manage.py loaddata data.json
```


Start the server:

```bash
py manage.py runserver
```


In your browser of choice, go to the address:
http://127.0.0.1:8000/


Good resources:
https://pcjericks.github.io/py-gdalogr-cookbook/index.html

https://www.djangoproject.com/start/overview/

https://openlayers.org/



## Reach Out...

<p align='center'><a href="https://twitter.com/JWokiri"><img height="30" src="https://www.flaticon.com/svg/static/icons/svg/145/145812.svg"></a>&nbsp;&nbsp;&nbsp
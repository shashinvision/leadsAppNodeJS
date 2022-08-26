## ALERTA Aplicación en Desarrollo
### Aplicación para leer logs de Leads del plugin de AMO en la BBDD WordPress

### Instrucciones de instalación y compilado:

## Posterior a la clonación solo la primera vez realizar:
```
npm install
```

## Para compilar el JS con Babel para no tener problemas de compatibilidad usar:
```
npm run build
```

### IMPORTANTE: debes tener a mano el ACCESS_TOKEN que solo dura 24 horas, por lo que debes tomarlo de la confg del plugin de AMO en Wordpress, como aparece en la imagen adjunta

![img con el access token](./img/AMOForm1.png)

### Debes insertar los datos de las variables de entorno para la conexión de la BBDD Wordpress, copia el example como indica el siguiente código
```
cp .env.example .env
```

## Con el siguiente comando el proyecto se ejecutara de forma automatica:
```
npm run start
```

## Una vez ejecutado el proyecto mostrara tu IP PUBLICA en el caso que lo necesites para desbloquear el acceso a la BBDD de wordpres en azure. Para usarlo solo se te pedira la fecha desde cuando quieras revisar los leads, se creara un log en pantalla a tiempo real y al finalizar el proceso guardara todo en un archivo fecha-hora-log.txt en el proyecto, de esa forma podras ver en que fallaron algunos procesos.


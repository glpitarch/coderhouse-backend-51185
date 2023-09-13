# e-commerce: Naturalia

## Proyecto final del curso de Backend de [CoderHouse](https://www.coderhouse.com/) / comisión #51185

## Dependencias utilizadas

### Backend:

#### Framework:
➤ [express](https://expressjs.com/): v4.18.2

#### Base de datos y almacenamiento:
➤ [connect-mongo](https://www.mongodb.com): v5.0.0
➤ [mongoose](https://mongoosejs.com): v7.1.0
➤ mongoose-paginate-v2: v1.7.1

#### Sesiones de Usuarios:
➤ express-session: v1.17.3
➤ [passport](https://www.passportjs.org/): v0.6.0
➤ passport-github2: v0.1.12
➤ passport-local: v1.0.0

#### Email Sending:
➤ [nodemailer](https://nodemailer.com): v6.9.3

#### Testing:
➤ chai: v4.3.7
➤ mocha: v10.2.0
➤ supertest: v6.3.3

#### Hashing y WebToken:
➤ bcrypt: v5.1.0
➤ jsonwebtoken: v9.0.1

#### Documentación de la API:
➤ [swagger-jsdoc](https://swagger.io/): v6.2.8
➤ swagger-ui-express: v5.0.0

#### Otras Dependencias:
➤ [socket.io](https://socket.io/): v4.6.1
➤ winston: v3.10.0
➤ multer: v1.4.5-lts.1
➤ uuid: v9.0.0
➤ @faker-js/faker: v8.0.2
➤ commander: v11.0.0
➤ dotenv: v16.1.4

### Frontend:

#### Renderizado:
➤ [express-handlebars](https://handlebarsjs.com): v7.0.6

#### Estilos del Proyecto:
➤ [node-sass](https://sass-lang.com/): v8.0.0  

### Estructura archivo .env:

PORT = number
MONGO_URL = string
ADMIN_EMAIL = string
ADMIN_PASS = string
SECRET_WORD = string
PERSISTENCE = string
CLIENT_ID = string
CLIENT_SECRET = string
CALLBACK_URL = string
MAILER_EMAIL = string
MAILER_EMAIL_PASS = string
EMAIL_TOKEN_SECRET_KEY = string
ENVIRONMENT = string

## Brief

La app comienza en la pantalla de login (":/"), donde el usuario puede:

1. Loguearse. 
	1.1. Tendrá que ingresar su dirección de mail y contraseña previamente registradas.
2. Acceder al Registro.
	2.2. Ingresando dirección de mail y contraseña como inputs OBLIGATORIOS y otros datos como nombre, apellido y edad.
3. Acceder a la opción de Recuperación de Contraseña.
	3.1. Guiará al usuario en una seria de pasos para cambiar su contraseña.
	3.2. Deberá ingresar su dirección de email.
	3.3. Se le enviará un mail a dicha dirección con un formulario para concretar el cambio. La validez del mail generado para cambiar la contraseña es de 1 hora.
	3.4. Accediendo al link del mail recibido, el usuario debera ingresar nuevamente su dirección de mail y su nueva contraseña (la contraseña nueva ingresa debe ser distinta a la vieja contraseña).

Luego de un correcto login el usuario es redirigido a (":/products"), donde puede:

1. Visualizar el navbar en la parte superior de la pantalla (el navbar podrá visualizarse en el resto de las secciones mencionadas a continuación). 
	1.1. Visualizar el Logo de la Marca.
		1.2. Al hacer click se redirige a (":/products").
	2.1. Poder realizar un filtro categórico de productos mediante la sección "Productos".
	3.1. Acceder al Chat Online.
		3.2. El usuario podrá chatear con los demás usuarios mediante un chat online sostenido con socket.io.
	4.1. Acceder a su Carrito.
		4.2. El usuario podrá visualizar los productos que contiene su carrito, aquellos que haya agregado al mismo.
		4.3. Realizar la compra.
		4.4. Se le enviará un mail con un ticket generado con el monto total de la compra, excluyendo aquellos productos que no cuenten con el stock suficiente al requerido por el usuario (notificando al usuario este último dato).
	5.1. Visualizar datos de su cuenta como: rol: nombre + apellido e email, botón de cerrar sesión y acceder a su perfil haciendo click en el icono de usuario.
		5.2. Podrá visualizar todos los datos NO sensibles de su cuenta (nombre completo (nombre + apellido), mail, edad y rol).
		5.3. Podrá cerrar su sesión mediante un botón.
		5.4. Podrá subir archivos (Identificación, Domicilio, Estado de cuenta) para que el administrador pueda cambiar su rol a "premium" si presenta la documentación "completa".
	6.1. Acceder a un botón de "Búsqueda Avanzada".
		6.2. El usuario podrá realizar filtrados de los productos por categoria, stock, precio, ordenamiento de mayor a menor o viceversa por precio o nombre del producto.
		6.3. Podrá realizar una combinación de filtros utilizando cualquiera de ellos, mencionados en el punto 6.2.
2. Visualizar todos los productos.
	2.1. Cada producto cuenta con un botón de "Agregar al carrito".
	2.2. Se podrá visualizar un botón de página "siguiente" o "anterior" dependiendo el caso.

Si el login coincide con el de un administrador:

1. No podrá agregar productos a su carrito, por lo tanto, no podrá realizar una compra.
2. No podrá ingresar al Chat Online de los usuarios.
3. Podrá acceder a la sección "Real Time Products"
	3.1. Podrá visualizar todos los productos incluyendo el ID de la base de datos.
	3.2. Tendrá la posibilidad de eliminar productos mediante el ingreso de su ID.
	3.3. Tendrá la posibilidad de agregar productos.
4. Podrá acceder a la sección de "Manager Usuarios".
	4.1. Podrá acceder a un botón que elimine a todos los usuarios que no sean administradores y que posean una inactividad mayor a 2 días.
	4.2. Podrá visualizar a todos los usuarios con su nombre completo, email, rol, documentación y fecha y hora de última conexión.
		4.2.1 Podrá eliminar usuarios individualmente mediante un botón.
		4.2.2 Podrá convertir un usuario de rol "user" a "premium" que cumpla con toda la documentación requerida mediante un botón, podrá hacer el paso contrario sin necesidad de requerir la documentación completa.

### Existen algunas caracteristicas más que no se encuentran expresadas en el front.
		
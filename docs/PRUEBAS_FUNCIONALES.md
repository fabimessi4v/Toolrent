# Documento de Pruebas Funcionales - Sistema Toolrent

**Proyecto:** Gestión de Arriendo de Herramientas

**Formato:** Gherkin / Markdown

**Herramientas:** Selenium IDE (50% automatización requerida)

---

## Épica 2: Gestión de Préstamos y Devoluciones

### Escenario 1: Registro exitoso de préstamo (Automatizado en Selenium)

**Gherkin:**

- **Given** que el empleado está autenticado y en el formulario de "Nuevo Préstamo"
    
- **When** ingresa el Nombre del cliente "Carlos Ruiz" y el nombre de herramienta "Taladro Bosch"
    
- **And** selecciona una fecha de devolución válida (posterior a hoy)
    
- **And** presiona "Crear Préstamo"
    
- **Then** el sistema debe registrar el préstamo y mostrar "Préstamo creado con éxito"
    
    

**Validación Selenium IDE:**

- **Command:** `wait for element visible`
    
- **Target:** `css=.toast-success`
    

---

### Escenario 2: Bloqueo de préstamo por deuda pendiente (Automatizado en Selenium)

**Gherkin:**

- **Given** que el cliente "Eusebio Rojas" tiene una multa impaga
    
- **When** el empleado intenta registrar un nuevo préstamo para este cliente
    
- **Then** el sistema debe impedir la operación
    
- **And** mostrar el mensaje "El cliente tiene multas impagas y no puede solicitar nuevos prestamos".
    

**Validación Selenium IDE:**

- **Command:** `wait for element visible`
    
- **Target:** `css=.toast-error`
    

---

### Escenario 3: Validación de disponibilidad (Stock 0)

**Gherkin:**

- **Given** que la herramienta "Generador Eléctrico" tiene stock actual "0"
    
- **When** el empleado intenta seleccionarla para un préstamo
    
- **Then** el sistema debe mostrar la herramienta como "No Disponible"
    
- **And** el botón de confirmación debe estar deshabilitado.
    

---

### Escenario 4: Cálculo automático de multa por atraso

**Gherkin:**

- **Given** un préstamo cuya fecha pactada fue hace 2 días
    
- **When** el empleado registra la devolución hoy
    
- **Then** el sistema debe calcular una "Multa por atraso" equivalente a 2 días de tarifa diaria
    
- **And** mostrar el monto total a pagar antes de cerrar la devolución.
    

**Validación Selenium IDE:**

- **Command:** `assertValue`
    
- **Target:** `id=total-fine-display`
    
- **Value:** `3000` (Asumiendo tarifa de 1500/día)
    

---

### Escenario 5: Devolución con daño irreparable (Baja automática)

**Gherkin:**

- **Given** que se está registrando la devolución de una herramienta
    
- **When** el empleado marca el estado de la herramienta como "Daño Irreparable"
    
- **Then** el estado de la herramienta debe cambiar a "Dada de baja"
    
- **And** se debe generar automáticamente un cobro por "Valor de reposición" al cliente.
    

---

### Escenario 6: Límite de préstamos simultáneos por cliente (Automatizado en Selenium)

**Gherkin:**

- **Given** que el cliente "Carlos Ruiz" ya tiene 5 préstamos activos
    
- **When** el empleado intenta registrar el préstamo número 6
    
- **Then** el sistema debe denegar la acción
    
- **And** mostrar "Límite máximo de préstamos alcanzado (5)".
    

**Validación Selenium IDE:**

    
- **Command:** `wait for element visible`
    
- **Target:** `css=.toast-error`
    

---

### Escenario 7: Restricción de doble unidad de la misma herramienta

**Gherkin:**

- **Given** que el cliente ya tiene en su poder un "Taladro Bosch"
    
- **When** el empleado intenta prestarle otra unidad del mismo "Taladro Bosch"
    
- **Then** el sistema debe bloquear la transacción por regla de "Unidad única por herramienta".
    
- **And** Muestra mensaje "La herramienta ya existe"

---

## Épica 6: Reportes y Consultas

### Escenario 1: Listado de préstamos atrasados (Automatizado en Selenium)

**Gherkin:**

- **Given** que existen préstamos cuya fecha de devolución ya venció
    
- **When** el usuario accede al reporte de "Préstamos Activos"
    
- **And** filtra por estado "Vencidos"
    
- **Then** la tabla debe mostrar únicamente los registros con fecha vencida.
    

**Validación Selenium IDE:**

- **Command:** `assertElementNotPresent`
    
- **Target:** `xpath=//td[contains(text(), 'Vigente')]`
    

---

### Escenario 2: Ranking de herramientas más solicitadas (Automatizado en Selenium)

**Gherkin:**

- **Given** que se han realizado múltiples préstamos en el mes
    
- **When** el administrador genera el reporte de "Herramientas más prestadas"
    
- **Then** el sistema debe mostrar un ranking descendente basado en la cantidad de registros en el Kardex.
    

**Validación Selenium IDE:**

- **Command:** `assertText`
    
- **Target:** `css=tr:nth-child(1) .tool-name`
    
- **Value:** `Taladro Bosch` (O la herramienta con más préstamos)
    

---

### Escenario 3: Filtro de reportes por rango de fechas

**Gherkin:**

- **Given** que el administrador está en el módulo de reportes
    
- **When** ingresa el rango desde "2026-01-01" hasta "2026-01-15"
    
- **Then** todos los datos mostrados en el reporte deben pertenecer exclusivamente a ese periodo.
    

---

### Escenario 4: Consulta de clientes con atrasos (Automatizado en Selenium)

**Gherkin:**

- **Given** que el cliente "Juan Pérez" tiene un préstamo vencido no devuelto
    
- **When** el empleado consulta el reporte de "Clientes con Atrasos"
    
- **Then** el RUT y nombre de "Juan Pérez" deben aparecer en la lista.
    

**Validación Selenium IDE:**

- **Command:** `verifyElementPresent`
    
- **Target:** `xpath=//td[contains(text(), 'Juan Pérez')]`
    

---

### Escenario 5: Visualización de estado del Kardex tras devolución

**Gherkin:**

- **Given** que se acaba de registrar una devolución
    
- **When** el administrador consulta el reporte de movimientos (Kardex)
    
- **Then** debe aparecer un movimiento tipo "Devolución" con la fecha exacta de la operación.
    

---

### Escenario 6: Exportación de reporte a PDF (Validación de interfaz)

**Gherkin:**

- **Given** que se ha generado un reporte de préstamos activos
    
- **When** el usuario hace clic en el botón "Exportar PDF"
    
- **Then** el sistema debe iniciar la descarga del archivo con los datos visibles en pantalla.
    

---

### Escenario 7: Validación de rol para acceso a reportes (Automatizado en Selenium)

**Gherkin:**

- **Given** que un usuario con rol "Empleado" intenta acceder a la URL `/admin/reports`
    
- **When** el sistema procesa la solicitud
    
- **Then** el sistema debe denegar el acceso
    
- **And** redirigir a una página de error 403 o al Home.
    

**Validación Selenium IDE:**

- **Command:** `assertTitle`
    
- **Target:** `Acceso Denegado`
    


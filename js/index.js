cambiarDestino();

function cambiarDestino() {
    let destino = document.getElementById("destino").value;
    let playa = document.getElementById("act_playa");
    let monte = document.getElementById("act_monte");
    let turismo = document.getElementById("act_urbano");
    let precioBase = document.querySelector("#precio_base");

    let destinoEligido = document.querySelector("#destino_eligido");

    playa.style.display = "none";
    monte.style.display = "none";
    turismo.style.display = "none";


    switch (destino) {
        case "200":
            playa.style.display = "flex";
            destinoEligido.innerHTML = "Playa"
            precioBase.innerHTML = destino + "€";
            break;
        case "250":
            monte.style.display = "flex";
            destinoEligido.innerHTML = "Montaña"
            precioBase.innerHTML = destino + "€";
            break;
        case "150":
            turismo.style.display = "flex";
            destinoEligido.innerHTML = "Turismo urbano"
            precioBase.innerHTML = destino + "€";

    }

}



function mostrarExtras() {
    let labels = document.querySelectorAll("input[type=checkbox]:checked + label");
    let extras = document.querySelector("#extras_eligido");

    extras.innerHTML = "";

    for (let i = 0; i < labels.length; i++) {
        let texto = labels[i].innerHTML;
        let nombreActividad = texto.split("-")[0];

        if (labels[i].getAttribute('for') == 'taxi') {
            let precio = document.querySelector("#taxi").value;
            nombreActividad = `Transporte desde/hacia el aeropuerto (Taxi ${precio}€)`
        }

        extras.innerHTML += `<tr>
            <td colspan="2"> ${nombreActividad}</td>
            </tr>`;

    }


}


function eligirTaxi() {
    let numPersonas = Number(document.getElementById("num_personas").value);

    let taxiLabel = document.querySelector("#taxi + label");

    let taxiEligido = document.querySelector("#taxi");

    if (numPersonas <= 4) {
        taxiLabel.innerHTML = "1-4 personas: 40€ (Taxi)";
        taxiEligido.value = 40;
    } else if (numPersonas <= 7) {
        taxiLabel.innerHTML = "4-7 personas: 70€ (Taxi XXL)";
        taxiEligido.value = 70;
    } else if (numPersonas <= 15) {
        taxiLabel.innerHTML = "8 o más personas: 120€ (Minibús privado)";
        taxiEligido.value = 120;
    }

    mostrarExtras();

}



function calcularPrecio() {
    let destino = document.querySelector("#destino").value;
    let inicio = document.querySelector("#fecha_inicio").value;
    let fin = document.querySelector("#fecha_fin").value;
    let fechaInicio = new Date(inicio);
    let fechaFin = new Date(fin);
    let dias = fechaFin - fechaInicio;
    let finalDias = dias / (1000 * 60 * 60 * 24)
    let numPersonas = Number(document.getElementById("num_personas").value);

    if (destino === ""){
        alert("Elige tu destino");
        document.querySelector("#contenedor_modal").style.display="none";
        return;
    }

    if (fechaFin < fechaInicio) {
        alert("Rango de fechas inválido.");
        return;
    }

    if ((numPersonas < 1) || (numPersonas > 15)) {
        alert("El número de personas debe ser mínimo 1 y máximo 15.");
        return;
    }

    document.querySelector("#contar_fechas").innerHTML = inicio + " hasta " + fin + " (" + finalDias + " días)";
    document.querySelector("#contar_personas").innerHTML = numPersonas + " personas";
    document.querySelector("#dias_base").innerHTML = finalDias + " días";
    document.querySelector("#personas_base").innerHTML = numPersonas + " personas";
    let totalBase = document.querySelector("#totalBase").innerHTML = destino * finalDias * numPersonas;


    let nombreActividad = document.querySelectorAll("input[type=checkbox]:checked + label");
    let extrasPrecio = document.querySelectorAll("input[type=checkbox]:checked");
    let extrasCalc = document.querySelector("#calc_extras");

    let actividadesTotal = 0;
    extrasCalc.innerHTML = "";

    for (let i = 0; i < nombreActividad.length; i++) {
        let texto = nombreActividad[i].innerHTML;
        let extrasNombre = texto.split("-")[0];
        let totalPrecio = extrasPrecio[i].value * numPersonas;

        if (nombreActividad[i].getAttribute('for') == 'taxi') {
            totalPrecio = extrasPrecio[i].value;
            extrasCalc.innerHTML += `<tr>
                    <td>${extrasNombre = `Transporte`}</td>
                    <td colspan="3">${totalPrecio}€</td>
                    <th>${totalPrecio}</th>
                </tr>`;
        } else if (nombreActividad[i].getAttribute('for') == 'comidas') {
            totalPrecio = extrasPrecio[i].value * numPersonas * finalDias;

            extrasCalc.innerHTML += `<tr>
                    <td>${extrasNombre}: </td>
                    <td>${extrasPrecio[i].value}€</td>
                    <td>${finalDias} dias</td>
                    <td>${numPersonas} personas</td>
                    <th>${totalPrecio}</th>
                </tr>`;
        } else {
            extrasCalc.innerHTML += `<tr>
            <td>${extrasNombre}: </td>
            <td colspan="2">${extrasPrecio[i].value}€</td>
            <td>${numPersonas} personas</td>
            <th>${totalPrecio}</th>
            </tr>`;
        }

        actividadesTotal += Number(totalPrecio);

    }

    let tablaTotal = document.querySelector("#total_extras");
    let subTotal = totalBase + actividadesTotal;
    let descuento1 = subTotal * (10/100);
    let descuento2 = subTotal * (15/100);


    if ((finalDias >= 5) && (numPersonas >= 4)) {
        tablaTotal.innerHTML = `<tr>
                    <th colspan="4">Subtotal:</th>
                    <th>${subTotal}€</th>
                </tr>
                <tr>
                    <th colspan="5">Descuentos aplicados:</th>
                </tr>
                <tr>
                    <td colspan="5" style="text-align: center;">10% de descuento (más de 5 días): ${descuento1}€</td>
                </tr>
                <tr>
                    <td colspan="5" style="text-align: center;">15% de descuento (más de 4 personas): ${descuento2}€</td>
                </tr>
                <tr>
                    <th colspan="4">Total final:</th>
                    <th>${subTotal - descuento1 - descuento2}€</th>
                </tr>`;
    } else if (finalDias > 5) {
        tablaTotal.innerHTML = `<tr>
                    <th colspan="4">Subtotal:</th>
                    <th>${subTotal}€</th>
                </tr>
                <tr>
                    <th colspan="5">Descuentos aplicados:</th>
                </tr>
                <tr>
                    <td colspan="5" style="text-align: center;">10% de descuento (más de 5 días): ${descuento1}€</td>
                </tr>
                <tr>
                    <th colspan="4">Total final:</th>
                    <th>${subTotal - descuento1}€</th>
                </tr>`;
    } else if (numPersonas > 4) {
        tablaTotal.innerHTML = `<tr>
                    <th colspan="4">Subtotal:</th>
                    <th>${subTotal}€</th>
                </tr>
                <tr>
                    <th colspan="5">Descuentos aplicados:</th>
                </tr>
                <tr>
                    <td colspan="5" style="text-align: center;">15% de descuento (más de 4 personas): ${descuento2}€</td>
                </tr>
                <tr>
                    <th colspan="4">Total final:</th>
                    <th>${subTotal - descuento2}€</th>
                </tr>`;
    } else {
        tablaTotal.innerHTML = `<tr>
                    <th colspan="4">Subtotal:</th>
                    <th>${subTotal}€</th>
                </tr>
                <tr>
                    <th>Descuentos:</th>
                    <td colspan="4" style="text-align: center;">(NO aplica, menos de 5 días y menos de 4 personas)</td>
                </tr>
                <tr>
                    <th colspan="4">Total final:</th>
                    <th>${subTotal}€</th>
                </tr>`;
    }

    document.querySelector("#contenedor_modal").style.display="flex";

        console.log(subTotal, descuento1, descuento2);
    }


    function salirModal() {
        let input = document.querySelectorAll(`input, select`);
        for (let i=0; i <input.length; i++) {
            if (input[i].type === `checkbox`) {
                input[i].checked = false;
            } else {
                input[i].value = "";
            }
        }

        document.querySelector("#contenedor_modal").style.display="none";
        cambiarDestino();
    }









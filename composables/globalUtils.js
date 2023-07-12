export const resultadosFinales = (per) => {
    const resultados = []
    const importePersonaSinGasto = Number((gastoTotal.value / personasTotal.value ).toFixed(2));
    let totalPersonasSinGasto =  personasTotal.value - [...per.map(persona=> persona.gastos)].length;
  
    // Personas con gastos
    per.forEach(persona=>{
        if (!persona.gastos) return false;
  
        const gasto = Number(gastoPersona(persona).toFixed(2));
  
        if (gasto > importePersonaSinGasto){
            resultados.push(`${persona.name} pago $${gasto} y debe recuperar $${Math.abs(gasto-importePersonaSinGasto).toFixed(2)}`)
        }else{
            resultados.push(gasto===importePersonaSinGasto ? `${persona.name} pago $${gasto} y no debe pagar ni recuperar nada.` : `${persona.name} pago $${gasto} y ademas debe pagar $${Math.abs(gasto-importePersonaSinGasto)}`)
        }
    })
  
    // Personas sin gasto
    if (totalPersonasSinGasto>0) resultados.push(`Las ${totalPersonasSinGasto} personas sin gasto deben pagar $${importePersonaSinGasto}`)
  
    refTotal.value = [...resultados]
    return resultados
  }
  
export const copiarResultados= (totales) => {
    navigator.clipboard.writeText([...totales].join('\n'));
    mensajesCopiados.value = true;
}

  

import { getPersona } from './personaUtils.js'

export const gastoTotal = ref(0)

export const calculoTotal = () => {
    const personas = getPersonas();
    let gastoTot = 0;
    personas.value.map(item=>{
        const gastoPersona = item.gastos.reduce((ptotal, g)=> ptotal+Number(g.importe),0)
        gastoTot+=gastoPersona;
    })
    return gastoTot;
}
  
export const gastoPersona = (persona) => persona.gastos.reduce((a, b) => a+Number(b.importe), 0)
  
export const getGasto= (persona, idGasto) => persona.gastos.filter(_gasto=>_gasto.id === idGasto)[0]
  
export const confirmarGasto = (persona, _importe, _que) => {
    persona.gastos.push({
        id: `pg-${crypto.randomUUID()}`,
        importe: _importe,
        que: _que
    })
}
  
export const confirmarEdicionGasto = (persona, gastoId, newImporte, newName)=> {
    const g = getGasto(persona,gastoId);
    g.importe = newImporte
    g.que = newName
}
  
export const eliminarGasto = (personaId, gasto) => {
    const personas = getPersonas();
    personas.value = personas.value.map(persona=>{
        if (persona.id !== personaId) return persona;

        if (persona.gastos.length>0) {
            persona.gastos = [...persona.gastos.filter(_gasto=>_gasto.id === gasto.id)]
        }
        return persona;
    })
}


  

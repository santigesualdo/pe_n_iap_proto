export const getPersonas = () => {
  return useState('personas', () => ref([]))
}

export const getPersona= (id) => {
  const personas = getPersonas();
  return personas.value.filter(_persona => _persona.id === id)[0]
}

export const newPersona = (newPersonaObj)=>{
  const personas = getPersonas();

  // TODO: 1 - si alguna validacion se ejecuta y se accede al return, mostrar mensaje

  /* Si 'currentPersona' no tiene valor exit */
  if (!newPersonaObj) return;

  /* Si 'currentPersona' ya existe exit */
  if (personas.value.some(el => el.name === newPersonaObj)) return;

  personas.value.push(
      {
          id: `p-${crypto.randomUUID()}`,
          name: newPersonaObj,
          gastos: []
      }
  )
}

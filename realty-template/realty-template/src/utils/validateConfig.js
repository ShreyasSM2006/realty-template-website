/** Dev-only sanity checks. Logs problems to the console; never throws. */
export function validateConfig(data) {
  const problems = []
  const ids = new Set()
  for (const p of data.properties || []) {
    if (!p.id) problems.push('A property is missing an id')
    if (ids.has(p.id)) problems.push(`Duplicate property id: ${p.id}`)
    ids.add(p.id)
    if (!['sale', 'rent'].includes(p.listingPurpose)) problems.push(`${p.id}: listingPurpose must be sale or rent`)
    if (!(Number(p.price) > 0)) problems.push(`${p.id}: price should be a positive number`)
  }
  if (!data.business?.name) problems.push('business.name is required')
  if (!data.business?.phone && !data.business?.whatsapp) problems.push('Add business.phone or business.whatsapp')
  if (problems.length) console.warn('[clientData] configuration problems:\n- ' + problems.join('\n- '))
  return problems
}

import { getPayload } from 'payload'
import configPromise from '@payload-config'
export const findAgentByName = async (name: string | undefined) => {
  const payload = await getPayload({ config: configPromise })
  const agent = await payload.find({
    collection: 'team-members',
    where: {
      title: {
        equals: name,
      },
    },
  })
  if (agent && agent.totalDocs > 0) {
    console.log('AGENT FOUND WITH NAME: ' + name)
    return agent.docs[0]
  }
  console.log('NO AGENT FOUND WITH NAME: ' + name)
  return undefined
}

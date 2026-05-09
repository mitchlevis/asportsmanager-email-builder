export interface SlashCommand {
  id: string
  label: string
  description: string
  icon: string
  insert: () => string
}

export const slashCommands: SlashCommand[] = [
  {
    id: 'loop',
    label: 'Repeater / Loop',
    description: 'Insert a repeater block',
    icon: 'mdi-repeat',
    insert: () => '{{#each variableName}}\n{{variableName.field}}\n{{/each}}',
  },
]

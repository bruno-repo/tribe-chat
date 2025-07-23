import { Reaction } from '../store/ChatStore';

export function groupReactionsByEmoji(reactions: Reaction[]) {
  const grouped: Record<string, Reaction[]> = {};
  for (const reaction of reactions) {
    if (!grouped[reaction.value]) {
      grouped[reaction.value] = [];
    }
    grouped[reaction.value].push(reaction);
  }
  return grouped;
}

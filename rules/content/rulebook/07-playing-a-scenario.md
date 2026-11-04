<!-- page 18 -->

## Playing a Scenario

Once a scenario is set up, it can then be played. Each scenario is broken up into a series of **rounds**, and each round consists of the following steps:

1. Card Selection 
1. Ordering of Initiative 
1. Character and Monster Turns 
1. End of Round 

Before any of these steps occur, apply any start-of-round effects from the scenario rules, such as spawning monsters. These effects can be applied in any order, though all spawning should happen at the same time (see [p.44](#page_44)).

### Card Selection

After start-of-round effects are applied, each character secretly selects two ability cards from their hand to play face down in front of themselves. Of the two cards, one should be selected as the initiative card. The initiative value at the center of that card will determine their position in the initiative order (see [p.19](#page_19)).

<img class="figure" alt="An ability card with its initiative value marked" src="figures/p18-initiative-value.webp" width="308" height="261">

Alternatively, if a character has at least two cards in their discard pile, they can instead declare a long rest at this time (see [p.38](#page_38)). They will then perform their long rest on initiative 99 as their entire turn for the round and will not play any cards.

Characters should not show each other the cards in their hand or give specific information about any **numeric value or title** on these cards. They are, however, allowed to discuss strategy and make general statements about their plans for the round.

| Communication Example |
|--|
|✅ "I’m attacking this Algox Archer near the end of the round."|
|✅ "I’m planning to move here and heal you pretty early, hopefully before the monsters attack."|
|✅ "Can you infuse earth on your turn? I will try to go after you."|
||
|❌ "You’ll need lower than 17 to go before me."|
|❌ "I’m going in the first quarter of the round."|
|❌ "I should be dealing 4 damage to the Algox Guard."|
|❌ "I need you there for Unbreakable Wall."|

<!-- page 19 -->

### Ordering of Initiative

After each character has selected two ability cards or declared a long rest, reveal the selected cards for each character who will not be long resting. Each character’s chosen initiative card should be directly on top of the other card, so that only one initiative value is visible. All cards can now be openly discussed.

In addition, reveal one monster ability card for each monster set that has at least one figure currently on the map. Note that several **monster types** (e.g., Black Imps, Forest Imps, or Snow Imps) may belong to the same **monster set** (e.g., Imps), in which case they would all use the same monster ability deck (e.g., the Imp deck).

Determine the initiative order by comparing the initiative values on all revealed monster ability cards (located in the upper left corner) and all characters’ initiative cards. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Take the initiative order tokens for all monster types and characters on the map and arrange them from **lowest to highest** (i.e., earliest to latest) initiative. 

Any character long resting has an initiative of 99. This indicates the turn order for this round.

<img class="figure" alt="Ordering initiative from revealed cards. Example: The Banner Spear goes first with initiative 15, followed by the Drifter with initiative 23, the Algox Guard with initiative 55, and the Boneshaper with initiative 81." src="figures/p19-ordering-initiative.webp" width="384" height="474">

#### Resolving ties

If there is a tie in initiative between multiple characters, compare the initiative values of those characters’ second played cards to break the tie. If there is still a tie, the party decides the order for those characters.

If multiple monster types of the same monster set are present, the special rules for the scenario will specify the order. If there is a tie in initiative between a character and a monster set, the character acts first.

In all other tied cases, the party decides the order.

#### Monster Order

During their position in the initiative order, the elites of a monster type take their turns in ascending standee number order (before any normal monsters of that type). Then, the normal monsters of that type take their turns in ascending standee number order (see [p.40](#page_40)).

#### Character Summons

Character summons take their turns during the summoning character’s position in the initiative order, but immediately before the character. Multiple summons from the same character take their turns in the order they were summoned (see [p.31](#page_31)).

#### Scenario Allies

Scenario allies with numbered tokens will have their initiative value specified in the special rules for the scenario. During their position in the initiative order, scenario allies take their turns in ascending token or standee number order (see [p.46](#page_46)).

<!-- page 20 -->

### Character and Monster Turns

Every figure on the map — both characters and monsters — will get a turn each round. A figure’s turn starts when the previous figure ends their turn and concludes when the next figure begins theirs. During a figure’s turn, they will perform various actions and abilities based on their revealed ability cards.

Before we tackle the specifics of character and monster turns, we need to cover a variety of important concepts related to actions and abilities.

#### Actions and Abilities Overview

##### Actions

An **action** is a set of one or more abilities, which are detailed on one half of an ability card.

Characters will normally perform two actions on their turn: the top action of one of their played ability cards and the bottom action of the other. An entire half of a character ability card is considered a single action.

Monsters will perform one action on their turn. An entire monster ability card is considered a single action.

An action can be referred to by any of its abilities. For example, if an action contains a "<img alt="Move Icon" title="Move Icon" src="icons/general/fh-move-bw-icon.png" class="fh-icon"> **2**" ability and a "<img alt="Loot Icon" title="Loot Icon" src="icons/general/fh-loot-bw-icon.png" class="fh-icon"> **2**" ability, it can be referred to as both a move action and a loot action.

<img class="figure" alt="Top and bottom actions on an ability card, and a monster action" src="figures/p20-actions.webp" width="384" height="340">

##### Abilities

An **ability** is any grouping of text and/or icons, often found on an ability card, that a figure can perform to interact with the map, themselves, or other figures.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If an action consists of multiple abilities, these will be separated from each other by ability lines. 

<img class="figure" alt="The abilities of an action, separated by ability lines" src="figures/p20-abilities.webp" width="363" height="278">

Abilities in an action are always performed in the order they are written. Figures cannot perform new abilities while resolving a different ability, with the exception of abilities from attack modifier cards.

Character abilities can be skipped, unless they are mandatory (see [p.37](#page_37)).

<!-- page 21 -->

#### Important Ability Concepts

##### Line-of-Sight

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> When any figure or hex is targeted by any ability, the acting figure must have a clear **line‑of‑sight** to the target in order to perform the ability. Line-of-sight is established if a line can be drawn from any part of the acting figure’s hex to any part of the target hex without touching a wall line. 

Only walls and closed doors block line-of-sight. Non-targeted abilities are not affected by line-of-sight. If an ability allows a figure to perform it as if occupying a different hex, draw the line from that hex.

<img class="figure" alt="Line-of-sight on a hex map. Example: There is clear line-of-sight to the Blinkblade from all three Algox Guards, but not from the Algox Archer due to a wall." src="figures/p21-line-of-sight.webp" width="384" height="314">

##### Target

<img alt="Target Icon" title="Target Icon" src="icons/general/fh-target-bw-icon.png" width="42">  Abilities accompanied by "**Target X**" allow the acting figure to target up to X different figures within the ability’s range. Targeting and range restrictions, as well as additional effects of the ability, apply to all targets. It is not possible to target the same figure multiple times with the same ability, unless otherwise stated.

If no target is specified on a targeted ability, the target value is 1, which means it only targets a single figure. For example, if an effect provides "**+1** <img alt="Target Icon" title="Target Icon" src="icons/general/fh-target-bw-icon.png" class="fh-icon">," it would give an ability with no specified target value "<img alt="Target Icon" title="Target Icon" src="icons/general/fh-target-bw-icon.png" class="fh-icon"> **2**."

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Attack ([p.25](#page_25)), conditions ([p.28](#page_28)), heal ([p.29](#page_29)), forced movement ([p.32](#page_32)), commanding figures ([p.33](#page_33)), and manipulating tiles ([p.33](#page_33)) are the only targeted abilities. Targeted abilities cannot be performed if there is no valid target.

##### Allies, Enemies, and Self

Characters are allies to other characters, monsters are allies to other monsters, and characters and monsters are enemies to each other. **Figures are not their own allies.**

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> In general, negative abilities can only target enemies, and positive abilities can only target allies or the acting figure themselves. Some abilities have specific targeting information that contradicts this rule. An ability specifying its targets as "all" follows these restrictions, but an ability specifying its targets as "all figures" targets both allies and enemies.

If any ability specifies its target as "self," the effect can only be applied to the acting figure.

##### Range

<img alt="Range Icon" title="Range Icon" src="icons/general/fh-range-bw-icon.png" width="42">  Most abilities target a figure, and a range value added to an ability determines how far away that figure can be. "**Range X**" means the acting figure can target any figure within X hexes, including the acting figure when permitted. **Range cannot be counted through walls** but can be counted through obstacles, figures, or anything else. Two hexes that share a wall but still have line-of-sight between them (e.g., through an open doorway) are considered to be at range 2 from each other.

Non-attack abilities with no specified range value can target figures at any range. Any ability with a range value specified in the highlighted section to its right is considered a ranged ability.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Figures treat the hex they occupy as adjacent for the purpose of targeting.

<img class="figure" alt="Counting range on a hex map. Example: The Blinkblade is at range 2 from the Algox Archer." src="figures/p21-range.webp" width="382" height="210">

<!-- page 22 -->

##### Area of Effect

Abilities with an area of effect allow the acting figure to target several different figures in multiple hexes at the same time. Rotating and mirroring the depicted area of effect is permitted.

<img alt="Grey Hex Icon" title="Grey Hex Icon" src="icons/general/fh-hex-player-color-icon.png" width="42">  Gray indicates the hex which the acting figure occupies. Any attack with an area of effect that includes a gray hex is always considered a melee attack (see [p.25](#page_25)).

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> <img alt="Blue Hex Icon" title="Blue Hex Icon" src="icons/general/fh-hex-summon-color-icon.png" width="42">  Blue indicates a hex which an ally must occupy. The ability cannot be performed otherwise. The ally is not targeted by the ability.

<img alt="Red Hex Icon" title="Red Hex Icon" src="icons/general/fh-hex-attack-color-icon.png" width="42">  Red indicates the hexes in which figures can be targeted. Only one red hex needs to be within the ability’s range. This initial hex does not need to contain a figure, but it cannot be inside a wall line, though other red hexes can be inside wall lines. Only figures within line-of-sight can be targeted. Allies in red hexes are not targeted by negative abilities, and enemies in red hexes are not targeted by positive abilities, unless otherwise stated.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> <img alt="Blank Hex Icon" title="Blank Hex Icon" src="icons/general/fh-hex-empty-color-icon.png" width="42">  Blank hexes are used as spacers between other types of hexes.

If an ability with an area of effect gains "**+1** <img alt="Target Icon" title="Target Icon" src="icons/general/fh-target-bw-icon.png" class="fh-icon">," an additional figure within the ability’s range, but outside the area of effect, can be targeted.

<img class="figure" alt="An area of effect placed on a hex map. Example: The Banner Spear performs the top action of Resolved Courage. An ally, the Blinkblade, is in the required hex. The Algox Guard and the objective are both within the ability’s area of effect." src="figures/p22-area-of-effect.webp" width="381" height="378">

##### Added Effects

Added effects are attached to an ability and modify it in some way. Common added effects like "<img alt="Push Icon" title="Push Icon" src="icons/conditions/fh-push-color-icon.png" class="fh-icon"> **X**," "<img alt="Pull Icon" title="Pull Icon" src="icons/conditions/fh-pull-color-icon.png" class="fh-icon"> **X**,"or conditions are usually listed in a highlighted section to the right of the ability. All conditional effects — those dependent on consuming an element (see [p.23](#page_23)) or paying some other cost — are listed below the ability in a highlighted section with a dotted line border.

<img class="figure" alt="A card with its added effects marked" src="figures/p22-added-effects.webp" width="364" height="156">

Added effects can be skipped, but the character must choose to do so before drawing an attack modifier card. Conditional effects can also be skipped; the character is not required to pay the cost and, even if they do, they may still choose not to apply the effect. In the case of a skippable effect attached to a multi-target attack ability, they may skip the effect on an attack-by-attack basis, in each case choosing before drawing an attack modifier card, unless otherwise stated.

More complex added effects might be written below the ability, but not all text below an ability is an added effect. Any text that provides rules for how the ability is performed (e.g., a targeting restriction) is an inherent part of the ability, not an added effect, and cannot be skipped.

<img class="figure" alt="A card showing which text is an added effect, a conditional effect or neither" src="figures/p22-not-added-effects.webp" width="364" height="159">

##### Conditional Triggers

Some abilities or effects can only occur if something else happens first. These conditional effects are structured as "Apply effect A to apply effect B." Effect A must be applied for effect B to be applied. If effect A cannot be applied, neither can effect B.

<!-- page 23 -->

##### Elements

Some actions have an elemental affinity associated with them (fire, ice, air, earth, light, or dark). If an elemental infusion is depicted on an action, when the acting figure performs any part of that action, they must infuse that element **at the end of their turn**.To infuse an element, move its token to the strong column on the element board. A figure cannot infuse an element this way unless they perform at least one of that action’s abilities.

|<img alt="Fire Icon" title="Fire Icon" src="icons/elements/fh-fire-color-icon.png" width="42"> |<img alt="Ice Icon" title="Ice Icon" src="icons/elements/fh-ice-color-icon.png" width="42"> |<img alt="Air Icon" title="Air Icon" src="icons/elements/fh-air-color-icon.png" width="42"> |<img alt="Earth Icon" title="Earth Icon" src="icons/elements/fh-earth-color-icon.png" width="42"> |<img alt="Light Icon" title="Light Icon" src="icons/elements/fh-light-color-icon.png" width="42"> |<img alt="Dark Icon" title="Dark Icon" src="icons/elements/fh-dark-color-icon.png" width="42"> |
|:-:|:-:|:-:|:-:|:-:|:-:|
|Fire|Ice|Air|Earth|Light|Dark|

At the end of every round, all infused elements wane, moving one column to the left on the element board, from strong to waning or from waning to inert.

Infused elements can be consumed to add effects to certain abilities or, in some cases, perform new abilities. This is represented by an element icon marked with an <img alt="Consume Icon" title="Consume Icon" src="icons/general/fh-locked-out-color-icon.png" class="fh-icon"> and followed by the added effect. If that element is strong or waning, it can be consumed. Since infusions don’t occur until the end of the turn, any consumed element must be already strong or waning at the start of the turn, prior to any infusions. To consume an element, move its token to the inert column on the element board.

If an ability depicts multiple separate elemental consumptions, the acting figure chooses which ones to activate. If a single elemental consumption depicts multiple elements, all of those elements must be consumed to activate it. The same element cannot be consumed multiple times in a single turn. 

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If an action depicts elemental consumptions in the upper left corner, all of those elements must be consumed to perform any part of the action.

<img class="figure" alt="Infusing and consuming elements on the element board. Example: The Boneshaper performs the top action of Decaying Will, which infuses earth, moving it from inert to strong at the end of their turn. Earth wanes at the end of the round, moving from strong to waning. In the following round, the Boneshaper performs the bottom action of Malicious Conversion and consumes earth, moving it from waning to inert, to gain +2 movement points." src="figures/p23-elements.webp" width="441" height="996">

<img alt="Wild Icon" title="Wild Icon" src="icons/elements/fh-wild-color-icon.png" width="42">  The wild icon represents any one of the six elements (but not all of them).

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> <img alt="Mixed Element Icon" title="Mixed Element Icon" src="icons/elements/fh-elements-mixed-color.png" width="42">  A mixed element icon, which depicts two elements within the same border, represents one of those two elements (but not both of them). When a wild or mixed element is infused, at the end of their turn, the acting figure chooses which of those elements to infuse.

<!-- page 24 -->

#### Abilities

##### Move

<img alt="Move Icon" title="Move Icon" src="icons/general/fh-move-bw-icon.png" width="42">  "**Move X**" is an ability that gives a figure X movement points. That figure may then spend those movement points to move one hex per movement point. Figures can move through allies but cannot move through enemies, obstacles, objectives, or walls. Traps and other effects of hexes trigger when a figure enters them.
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> A figure must always end their movement in an unoccupied hex. A figure must enter at least one hex to be considered to have performed a move ability. 

All unspent movement points are lost at the end of the move ability.

###### Jump

<img alt="Jump Icon" title="Jump Icon" src="icons/general/fh-jump-bw-icon.png" width="42">  "**Jump**" is an added effect of a move ability. Jumping allows a figure to ignore all enemies, obstacles, objectives, traps, and hazardous terrain, except for in the last hex. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Difficult terrain and icy terrain are ignored completely when jumping.

A figure cannot jump through walls.

###### Flying

<img alt="Flying Icon" title="Flying Icon" src="icons/general/fh-flight-bw-icon.png" width="42">  "**Flying**" is an active bonus (see [p.30](#page_30)). Flying allows a figure to completely ignore all enemies, obstacles, objectives, traps, and overlay terrain, including in the last hex. However, a flying figure still cannot end their movement in a hex occupied by another figure (and vice versa). If a flying figure occupies a hex with an immobilize trap or stun trap (see [p.29](#page_29)), treat them as an obstacle when determining the movement of other figures.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If a figure loses flying, treat them as if entering their current hex with a normal movement. In such cases, if the figure currently occupies a hex with an obstacle, they instead move into the closest unoccupied hex without an obstacle, triggering any effects of that hex.

##### Teleport

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> <img alt="Teleport Icon" title="Teleport Icon" src="icons/general/fh-teleport-bw-icon.png" width="42">  "**Teleport X**" is an ability that transports a figure to any location within X hexes of their current hex, without evaluating their path through all of the hexes between. A teleport ability is not considered a move ability, and teleporting is not considered movement. Teleportation is not affected by anything, even walls, in the hexes between. A figure can only teleport to a valid hex, and any effects of entering that hex still trigger normally, unless otherwise stated. A figure cannot teleport into an unrevealed room, but they can teleport to a hex with a closed door, opening the door as a result

<img class="figure" alt="A teleport on a hex map. Example: The Deathwalker performs the bottom action of Forceful Spirits, which allows them to teleport. They choose an unoccupied hex adjacent to their shadow token, per the ability’s requirement." src="figures/p24-teleport.webp" width="382" height="675">

<!-- page 25 -->

##### Attack

"**Attack X**" is a negative targeted ability that allows a figure to deal a base amount of X damage to an enemy within the specified range.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> An attack with no specified range value is considered a melee attack with range 1, capable of targeting adjacent enemies only, unless otherwise stated. For example, if an effect provides "**+ Y** <img alt="Range Icon" title="Range Icon" src="icons/general/fh-range-bw-icon.png" class="fh-icon">" to an attack, it would give the attack with no specified range value"<img alt="Range Icon" title="Range Icon" src="icons/general/fh-range-bw-icon.png" class="fh-icon"> **1 + Y**" and make it a ranged attack.

An **attack** is a single attack performed against one target, an **attack ability** is an ability that consists of one or more separate attacks, and an **attack action** is any action that contains at least one attack ability.

###### Attack Modification Order

When an attack is performed, the base attack value written on the card can be modified in four different ways in the following order:

1. All applicable attack bonuses and penalties, such as "**± <img alt="Attack Icon" title="Attack Icon" src="icons/general/fh-attack-bw-icon.png" class="fh-icon">**" effects, are applied. If there are multiple bonuses or penalties, the party chooses the order in which they are applied.
1. An attack modifier card is drawn from the attacker’s deck and applied.
1. The target’s shield bonus is applied (see [p.31](#page_31)).
1. > <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Ward and brittle are applied (see [p.28](#page_28)). If the target has both conditions, they negate each other and are removed.

Once all modifications have been applied, the target suffers the resulting amount of damage. If the target has any abilities or effects which can negate a source of damage, including losing cards to negate damage (see [p.38](#page_38)), they may apply them now.

These steps are repeated for each individual target of the attack ability, which means it is possible for different targets to suffer different amounts of damage from the same attack ability.

###### Attack Modifier Cards

Any time an attack ability is performed, **a separate attack modifier card is drawn for each individual target of the attack ability.** The modifier shown on the card is then applied to the attack, possibly reducing or increasing its value. Once the effects of a drawn modifier card have been applied, it is placed in its discard pile.

Attack modifier cards are only drawn for attacks. They are not used for any other type of effect that deals damage.

Characters each have their own deck, while all monsters share a single deck. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If a scenario includes scenario allies, they all use the separate ally deck.

Characters, monsters, and allies start with a standard deck of six <img alt="0 Icon" title="0 Icon" src="icons/attack-modifiers/fh-plus-0-bw-icon.png" class="fh-icon">, five <img alt="-1 Icon" title="-1 Icon" src="icons/attack-modifiers/fh-minus-1-color-icon.png" class="fh-icon">, five <img alt="+1 Icon" title="+1 Icon" src="icons/attack-modifiers/fh-plus-1-color-icon.png" class="fh-icon">, one <img alt="-2 Icon" title="-2 Icon" src="icons/attack-modifiers/fh-minus-2-color-icon.png" class="fh-icon">, one <img alt="+2 Icon" title="+2 Icon" src="icons/attack-modifiers/fh-plus-2-color-icon.png" class="fh-icon">, one <img alt="Miss Icon" title="Miss Icon" src="icons/attack-modifiers/fh-miss-icon.png" class="fh-icon">, and one <img alt="2X Icon" title="2X Icon" src="icons/attack-modifiers/fh-2x-icon.png" class="fh-icon">, but characters can customize their decks over time through perks (see [p.63](#page_63)), allowing for other diverse effects.

<img class="figure" alt="The standard attack modifier deck and how many of each card it holds" src="figures/p25-modifier-deck.webp" width="382" height="540">

<!-- page 26 -->

An attack modifier card can have the following:

<img class="figure" alt="Attack modifier card features, lettered A to F" src="figures/p26-modifier-features.webp" width="381" height="300">

<!-- letters -->

1. **Modifier Value:** This value modifies the attack value. The <img alt="Miss Icon" title="Miss Icon" src="icons/attack-modifiers/fh-miss-icon.png" class="fh-icon"> modifier reduces the final attack value to zero. The <img alt="2X Icon" title="2X Icon" src="icons/attack-modifiers/fh-2x-icon.png" class="fh-icon"> modifier doubles the current attack value.
1. **Added Effects:** Some modifiers have elemental infusions (see [p.23](#page_23)), conditions (see [p.28](#page_28)), or other added effects. When activated, these added effects function exactly as if written on the attack ability.
1. **Rolling Icon:** When a rolling modifier <img alt="Rolling Modifier Icon" title="Rolling Modifier Icon" src="icons/conditions/fh-rolling-color-icon.png" class="fh-icon"> is drawn, the attacker draws additional modifiers, one at a time, until a non-rolling modifier is drawn. The drawn modifiers can then be applied in any order.
1. **Bless / Curse Border:** Bless and curse cards are returned to the supply once resolved, instead of placed in the discard pile. Every curse card has a <img alt="Star Icon" title="Star Icon" src="icons/general/fh-star-icon.png" class="fh-icon"> or <img alt="Monster Icon" title="Monster Icon" src="icons/general/fh-monster-icon.png" class="fh-icon"> icon to indicate whether it is used in character and ally decks or the monster deck.
1. **Shuffle Icon:** At the end of the round in which a modifier with the shuffle icon <img alt="Shuffle Icon" title="Shuffle Icon" src="icons/general/fh-shuffle-icon.png" class="fh-icon"> is drawn, the discard pile is shuffled back into the deck. This shuffle is performed immediately if the deck is empty when a modifier must be drawn.
1. **Sorting Icon:** All standard modifiers have a <img alt="Player 1 Icon" title="Player 1 Icon" src="icons/general/fh-player-1-icon.png" class="fh-icon">, <img alt="Player 2 Icon" title="Player 2 Icon" src="icons/general/fh-player-2-icon.png" class="fh-icon">, <img alt="Player 3 Icon" title="Player 3 Icon" src="icons/general/fh-player-3-icon.png" class="fh-icon">, <img alt="Player 4 Icon" title="Player 4 Icon" src="icons/general/fh-player-4-icon.png" class="fh-icon">, <img alt="Ally Icon" title="Ally Icon" src="icons/general/fh-ally-icon.png" class="fh-icon">, or <img alt="Monster Icon" title="Monster Icon" src="icons/general/fh-monster-icon.png" class="fh-icon"> icon for easy sorting. All modifiers added to a character deck through perks (see [p.63](#page_63)) have their class icon. All modifiers added to a deck by another effect have the <img alt="Star Icon" title="Star Icon" src="icons/general/fh-star-icon.png" class="fh-icon"> icon.

###### Attack Effects

An attack effect is an effect attached to an attack. These effects are applied either during damage resolution or after the attack resolves. If applied after the attack resolves, the attack effect is still applied even if the attack deals no damage (including due to a <img alt="Miss Icon" title="Miss Icon" src="icons/attack-modifiers/fh-miss-icon.png" class="fh-icon"> card).

The attacker must choose whether to apply any attack effects before they draw an attack modifier card. All attack effects except "**+X** <img alt="Target Icon" title="Target Icon" src="icons/general/fh-target-bw-icon.png" class="fh-icon">" are applied before any retaliate bonus (see [p.31](#page_31)). The "**+X** <img alt="Target Icon" title="Target Icon" src="icons/general/fh-target-bw-icon.png" class="fh-icon">" effect allows the attacker to perform additional attacks, and each attack must be resolved completely before another can be performed.

<table>
  <tr><th colspan="2" align="center">Timing of Attack Effects</th></tr>
  <tr><td><strong>+X Attack</strong> (<a href="#page_25">p.25</a>)</td><td>during damage resolution (must be applied)</td></tr>
  <tr><td><strong>Pierce</strong> (<a href="#page_27">p.27</a>)</td><td>during damage resolution</td></tr>
  <tr><td><strong>+X Target</strong> (<a href="#page_21">p.21</a>)</td><td>after the attack resolves</td></tr>
  <tr><td><strong>Conditions</strong> (<a href="#page_28">p.28</a>)</td><td>after the attack resolves</td></tr>
  <tr><td><strong>Forced Movement</strong> (<a href="#page_32">p.32</a>)</td><td>after the attack resolves</td></tr>
  <tr><td><strong>Other Added Effects</strong> (written below the attack)</td><td>after the attack resolves</td></tr>
  <tr><td><strong>Elemental Infusions</strong> (<a href="#page_23">p.23</a>)</td><td>after the attack resolves</td></tr>
</table>

Some attacks have abilities (e.g., heal abilities) that aren’t attack effects but are still attached to the attack. These abilities are performed after the attack is resolved completely (including after any retaliate bonus).

Some modifiers have added effects, besides modifying the attack value, and **an attacking character can always choose** whether to apply those effects after the modifier is drawn. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If another figure uses a character’s deck, the character controls the added effects of the modifier even though the attacking figure applies them.

Modifiers that affect a character’s class-specific resources (e.g., the Blinkblade’s time tokens) or abilities (e.g., the Drifter’s use slot tokens) are always applied to that character, no matter who draws the modifier.

<!-- page 27 -->

###### Advantage and Disadvantage

Some effects cause an attack to gain advantage or disadvantage. With **advantage**, the attacker draws two modifiers and uses one of them. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> A monster always uses the better one, but a character may use either one. With **disadvantage**, the attacker draws two modifiers and always uses the worse one.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If the first draw with advantage or disadvantage is a rolling modifier <img alt="Rolling Modifier Icon" title="Rolling Modifier Icon" src="icons/conditions/fh-rolling-color-icon.png" class="fh-icon">, the attacker draws additional modifiers, one at a time, until a non-rolling modifier is drawn. **They then draw one more modifier and ignore any rolling icon on it.** 
>
> The first non-rolling modifier and the one after it are compared. If the attack has advantage, the attacker uses all initial rolling modifiers and whichever of the last two modifiers they choose. If the attack has disadvantage, the attacker ignores all initial rolling modifiers and uses whichever of the last two modifiers is worse.
>
> If the first draw with advantage or disadvantage is not a rolling modifier, but the second draw is, the rolling icon on the second modifier is still ignored.

When there is ambiguity about which modifier is worse, the attacker must use the one drawn first. Ambiguity occurs when comparing the non-numeric effects of some modifiers (e.g., elemental infusions or negative conditions). Any non-numeric effect is considered to have a positive but undefined value.

An attack cannot gain multiple instances of advantage or disadvantage. If an attack has both advantage and disadvantage, it is considered to have neither.

**Any ranged attack on an adjacent enemy automatically gains disadvantage.**

<img class="figure" alt="Four examples of drawing modifiers with advantage and disadvantage. Example 1: The attack has advantage, so two modifiers are drawn and compared, then the +1 modifier is used. Example 2: The attack has advantage, and the first modifier drawn has a rolling icon, so a second modifier without a rolling icon is drawn, followed by a third, final modifier. The initial rolling modifier and the +1 modifier are used. Example 3: The attack has disadvantage, so two modifiers are drawn and compared, then the -1 modifier is used. Example 4: The attack has disadvantage, and the first two modifiers drawn have rolling icons, so a third modifier without a rolling icon is drawn, followed by a fourth, final modifier. The initial rolling modifiers are ignored and the +0 modifier is used." src="figures/p27-advantage.webp" width="398" height="1020">

###### Pierce

<img alt="Pierce Icon" title="Pierce Icon" src="icons/conditions/fh-pierce-color-icon.png" width="42"> "**Pierce X**" is an added effect that reduces the target’s shield bonus (see [p.31](#page_31)) by X. Multiple "<img alt="Pierce Icon" title="Pierce Icon" src="icons/conditions/fh-pierce-bw-icon.png" class="fh-icon"> **X**" effects can be combined. For example, if an attack with "<img alt="Pierce Icon" title="Pierce Icon" src="icons/conditions/fh-pierce-bw-icon.png" class="fh-icon"> **2**" gains "<img alt="Pierce Icon" title="Pierce Icon" src="icons/conditions/fh-pierce-bw-icon.png" class="fh-icon"> **3**," the effect would reduce the target’s shield bonus by 5 for that attack.

<!-- page 28 -->

##### Conditions

A condition ability is a positive or negative targeted ability, depending on the specified condition, and causes the target of the ability to gain that condition.

When a monster gains a condition — except bless or curse — place the matching token on its stat sleeve in the section corresponding to the number on its standee. When a character gains a condition — except bless or curse — place the matching token on their character mat. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Bless and curse tokens are only used for tracking the effects of traps (see [p.14](#page_14)). Once gained, a condition remains until the requirements for its removal are met. Neither positive nor negative conditions can be removed voluntarily. A figure cannot have multiple instances of the same condition; however, if a figure gains a condition they already have, the effect’s duration resets.

If a figure gains a condition during their turn that is removed "at the end of the figure’s next turn," the condition goes into effect immediately and applies until the end of their next turn. Conditions which are removed at the end of a figure’s turn are only removed after all other end-of-turn effects are resolved.

A condition effect can also be added to other abilities as an added effect, causing all targets of the ability to gain that condition after its main effect is resolved. If the ability is an attack, the target gains the condition even if the attack dealt no damage, but they do not gain the condition if the attack killed or exhausted them, or if they are immune.

###### Positive Conditions

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon">  <img alt="Regenerate Icon" title="Regenerate Icon" src="icons/conditions/fh-regenerate-color-icon.png" width="42">  **Regenerate:** The figure performs "Heal 1, self" (see [p.29](#page_29)) at the start of each of their turns, even if they have stun. Regenerate is removed when the figure suffers damage. If a figure has both regenerate and wound (see [p.29](#page_29)), the regenerate effect is applied first, removing wound before it takes effect.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon">  <img alt="Ward Icon" title="Ward Icon" src="icons/conditions/fh-ward-color-icon.png" width="42">  **Ward:** The next time the figure suffers damage from any source, they instead suffer half that amount of damage (rounded down), and ward is then removed. If a figure that suffers damage has both ward and brittle (see [p.29](#page_29)), they negate each other and are removed.

<img alt="Invisible Icon" title="Invisible Icon" src="icons/conditions/fh-invisible-color-icon.png" width="42">  **Invisible:** The figure cannot be focused on or targeted by any enemy, though non-targeted abilities remain unaffected. The figure and their allies can still interact with each other. Invisible is removed at the end of the figure’s next turn.
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Enemies treat figures with invisible as if they were not there; they can move through figures with invisible but still cannot end their movement in the same hex.

<img alt="Strengthen Icon" title="Strengthen Icon" src="icons/conditions/fh-strengthen-color-icon.png" width="42">  **Strengthen:** The figure gains advantage on all of their attacks. Strengthen is removed at the end of the figure’s next turn.

<img alt="Bless Icon" title="Bless Icon" src="icons/conditions/fh-bless-color-icon.png" width="42">  **Bless:** The figure must shuffle a bless card into their attack modifier deck. If the figure does not use an attack modifier deck, bless has no effect. When a bless card is drawn, it acts as a <img alt="2X Icon" title="2X Icon" src="icons/attack-modifiers/fh-2x-icon.png" class="fh-icon"> modifier and is returned to the supply once resolved, instead of placed in the discard pile. There are 10 bless cards, which can be added to any deck. If there are no bless cards available, bless has no effect.

<!-- page 29 -->

###### Negative Conditions

<img alt="Wound Icon" title="Wound Icon" src="icons/conditions/fh-wound-color-icon.png" width="42">  **Wound:** The figure suffers 1 damage at the start of each of their turns. Wound is removed when the figure is healed.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> <img alt="Brittle Icon" title="Brittle Icon" src="icons/conditions/fh-brittle-color-icon.png" width="42">  **Brittle:** The next time the figure would suffer damage from any source, they instead suffer double that amount of damage, and brittle is then removed. Brittle is also removed if the figure is healed.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> <img alt="Bane Icon" title="Bane Icon" src="icons/conditions/fh-bane-color-icon.png" width="42">  **Bane:** The figure suffers 10 damage at the end of their next turn, and bane is then removed. Bane is also removed if the figure is healed.

<img alt="Poison Icon" title="Poison Icon" src="icons/conditions/fh-poison-color-icon.png" width="42">  **Poison:** All attacks targeting the figure gain "**+1** <img alt="Attack Icon" title="Attack Icon" src="icons/general/fh-attack-bw-icon.png" class="fh-icon">." Poison is removed when the figure is healed but, unlike wound/brittle/bane, poison prevents the heal from increasing the figure’s current hit point value.

<img alt="Immobilize Icon" title="Immobilize Icon" src="icons/conditions/fh-immobilize-color-icon.png" width="42">  **Immobilize:** The figure cannot perform any move abilities. Immobilize is removed at the end of the figure’s next turn.

<img alt="Disarm Icon" title="Disarm Icon" src="icons/conditions/fh-disarm-color-icon.png" width="42">  **Disarm:** The figure cannot perform any attack abilities. Disarm is removed at the end of the figure’s next turn.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> <img alt="Impair Icon" title="Impair Icon" src="icons/conditions/fh-impair-color-icon.png" width="42">  **Impair:** Impair can only be gained by characters. The character cannot use or trigger any items, but bonuses previously gained from items are still active. Impair is removed at the end of the character’s next turn. 

<img alt="Stun Icon" title="Stun Icon" src="icons/conditions/fh-stun-color-icon.png" width="42">  **Stun:** The figure cannot perform any abilities or use or trigger any items, but bonuses previously gained are still active. Stun is removed at the end of the figure’s next turn. At the start of the round, stunned characters still must select two cards to play (or declare a long rest), but the cards will be discarded with no effect if stun is not removed by some other means before the end of their turn. Long resting still occurs normally for stunned characters.

<img alt="Muddle Icon" title="Muddle Icon" src="icons/conditions/fh-muddle-color-icon.png" width="42">  **Muddle:** The figure gains disadvantage on all of their attacks. Muddle is removed at the end of the figure’s next turn.

<img alt="Curse Icon" title="Curse Icon" src="icons/conditions/fh-curse-color-icon.png" width="42">  **Curse:** The figure must shuffle a curse card into their attack modifier deck. If the figure does not use an attack modifier deck, curse has no effect. When a curse card is drawn, it acts as a <img alt="Miss Icon" title="Miss Icon" src="icons/attack-modifiers/fh-miss-icon.png" class="fh-icon"> modifier and is returned to the supply once resolved, instead of placed in the discard pile. There are 10 curse cards with the <img alt="Star Icon" title="Star Icon" src="icons/general/fh-star-icon.png" class="fh-icon"> icon, which can only be added to character and ally decks, and 10 curse cards with the <img alt="Monster Icon" title="Monster Icon" src="icons/general/fh-monster-icon.png" class="fh-icon"> icon, which can only be added to the monster deck. If there are no applicable curse cards available, curse has no effect. Immunity to curse prevents a figure from adding a curse card to their deck, but does not prevent a drawn curse card from taking effect.

##### Heal

<img alt="Heal Icon" title="Heal Icon" src="icons/general/fh-heal-bw-icon.png" width="42">  "**Heal X**" is a positive targeted ability that allows the target to heal X amount of damage, increasing their current hit point value. Characters heal damage by rotating their red dial. Monsters heal damage by removing damage tokens from their section of the stat sleeve. A figure’s current hit point value can never exceed their maximum hit point value, though it is permitted to heal a figure that is already at their maximum hit point value.

Heal effects from attack modifier cards function exactly like heal abilities. If multiple modifiers with heal effects are drawn, they are considered a single heal ability.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> A single heal can remove any combination of wound, brittle, bane, and poison from a figure. However, if poison is present, the hit point increase is prevented.

<!-- page 30 -->

##### Active Bonuses

An active bonus ability is any ability that provides an active bonus to a figure or their allies. When a character performs an active bonus ability, the card is placed in their active area to track the bonus. Cards in a character’s active area are not considered to be in their hand.

Active bonus abilities have icons to indicate the duration of the bonuses they provide. When a bonus expires, even if the action has other active bonus abilities, the card is removed from the character’s active area and placed in their discard pile or lost pile, depending on whether the action has a lost icon (see [p.38](#page_38)).

<img alt="Round Bonus Icon" title="Round Bonus Icon" src="icons/general/fh-round-bonus-color-icon.png" width="42">  Round Bonuses: These bonuses activate when the ability is performed and expire at the end of the round.

<img class="figure" alt="A round bonus on an ability card. Example: The Banner Spear performs the bottom action of Deflecting Maneuver, gaining shield 2 for all ranged attacks targeting them until the end of the round." src="figures/p30-round-bonus.webp" width="382" height="288">

<img alt="Persistent Bonus Icon" title="Persistent Bonus Icon" src="icons/general/fh-persistent-bonus-color-icon.png" width="42">  Persistent Bonuses: These bonuses activate when the ability is performed and expire when the specified removal condition has been fulfilled.

<img class="figure" alt="A persistent bonus on an ability card. Example: The Deathwalker performs the bottom action of Strength of the Abyss, gaining its bonus until the end of the scenario." src="figures/p30-persistent-bonus.webp" width="382" height="294">

If the bonus has limited uses, these are tracked by a series of use slots. When the card is placed in the active area, a character token is added to the first slot. Each time the bonus is triggered, the token advances by one slot, even if no benefit is gained. When the token passes an experience icon <img alt="Experience Icon" title="Experience Icon" src="icons/general/fh-xp-bw-icon.png" class="fh-icon">, the character gains that much experience (see [p.37](#page_37)). When the token leaves the last slot, the bonus expires. If no removal condition is specified, the bonus expires at the end of the scenario. If the bonus lasts for a limited number of rounds or turns, the round or turn in which it is activated does not count.

<img class="figure" alt="Tracking use slots with a character token. Example: The Boneshaper performs the bottom action of Wrath of the Turned Earth, adding a token to the first slot. After the first use, they gain 1 experience. After the third use, they gain 1 experience and place the card in their lost pile." src="figures/p30-use-slots.webp" width="382" height="372">

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> A character may voluntarily remove a card with a persistent bonus (but not a round bonus) from their active area before the bonus expires, but doing so removes the bonus. This can be done at any time except during another ability.

Actions with active bonus abilities might also have other abilities, but these other abilities are only performed when the card is played.

Cards without lost icons in your active area count as being in your discard pile for the purposes of whether you can long rest and what is eligible to lose during a long rest, but don’t have to be returned to your hand when resting.

<!-- page 31 -->

There is a wide variety of active bonus abilities. While these abilities are usually defined by text, there are three common ones to go over.

###### Shield

<img alt="Shield Icon" title="Shield Icon" src="icons/general/fh-shield-bw-icon.png" width="42">  "**Shield X**" is a positive ability that gives the acting figure a shield bonus of X. This reduces the attack value of an incoming attack by X. The shield bonus is only applied after all attack bonuses or penalties and modifiers have been applied. Multiple shield bonuses stack with one another as a single reduction in attack value. **A shield bonus does not apply to sources of damage that are not attacks.**
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> A shield ability always applies to the acting figure.

###### Retaliate

<img alt="Retaliate Icon" title="Retaliate Icon" src="icons/general/fh-retaliate-bw-icon.png" width="42">  "**Retaliate X**" is a positive ability that gives the acting figure a retaliate bonus of X. This deals X damage to any figure who attacks them, if they are within the specified range after all attack effects are resolved (including push or pull). If no range is specified, the bonus is only applied to adjacent attackers. This bonus is triggered by each attack and occurs after the attack is resolved. A retaliate bonus is not an attack or targeted effect, therefore the damage cannot be reduced by a shield bonus. If a retaliating figure is killed or exhausted by an attack, the retaliate bonus does not occur. Multiple retaliate bonuses stack with one another as a single source of damage, but each retaliate bonus is only applied within its specified range. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> A retaliate ability always applies to the acting figure.

###### Summon

Summon is a positive ability that adds other allied figures to the map. These figures, known as "summons," must be placed in different empty hexes adjacent to the summoner. If there is no adjacent hex available, the figure is not summoned.

A character summon is considered a persistent bonus, and their card is placed in the summoner’s active area. When the summon’s hit point value is reduced to zero, the summon is removed from the map. The summoner may voluntarily remove the summon from the map at any time except during another ability. The card is then placed in the summoner’s discard pile or lost pile, depending on whether the action has a lost icon (see [p.38](#page_38)).

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Each character summon has a corresponding standee, found in the summoner’s tuck box, that is used to represent them on the map, using a blue standee base.

When a character becomes exhausted, all of their summons are removed from the map.

Character summons have stats for their hit point, attack, move, and range values, along with any special traits listed on their ability cards. If a summon’s attack or move value is "–", then they do not perform that ability unless granted an ability with a base value. If a summon’s range value is "–", then they do not perform ranged attacks unless granted that ability (see [p.33](#page_33)).

A character summon’s turn in the initiative order is always directly before their summoner and is separate from the summoner’s turn. Summons are not controlled by their summoner, but instead obey automated monster rules, performing "<img alt="Move Icon" title="Move Icon" src="icons/general/fh-move-bw-icon.png" class="fh-icon">**+0**, <img alt="Attack Icon" title="Attack Icon" src="icons/general/fh-attack-bw-icon.png" class="fh-icon">**+0**" (see [p.41](#page_41)). A summon uses their summoner’s attack modifier deck when attacking. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If a character summon cannot find a focus, the summoner may choose for the summon to move toward them instead.

A character can have multiple summons on the map at once. Each new summon’s card is placed to the right of the previous summon’s card in the summoner’s active area. In such cases, the summons will act in that order (from left to right). If there are multiple copies of the same summon on the map at once, the order in which they were summoned determines their acting order, which can be tracked using their standee numbers.

**Summons never take a turn during the round in which they are summoned.**

<!-- page 32 -->

##### Forced Movement

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Forced movement is any negative targeted ability that allows a figure to control another figure’s movement or to teleport another figure. 

Forced movement must follow all normal movement rules for the target. For example, if a flying figure is forced to move, flying still applies. There are two primary forced movement abilities:

<img alt="Push Icon" title="Push Icon" src="icons/conditions/fh-push-color-icon.png" width="42">  "**Push X**" forces the target to move up to X hexes away from the acting figure. Each individual hex entered must place the target farther by range from the acting figure.

<img alt="Pull Icon" title="Pull Icon" src="icons/conditions/fh-pull-color-icon.png" width="42">  "**Pull X**" forces the target to move up to X hexes toward the acting figure. Each individual hex entered must place the target closer by range to the acting figure.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> When a character performs a push or a pull, they decide the direction and distance that the target moves. 

When a monster performs a push or a pull, the party decides the direction, but the target must move as far as possible. Push and pull are unaffected by difficult terrain, but all other normal movement rules are still applied (including the rules for flying figures). Immobilized or stunned figures can still be affected by push, pull, and teleport but not by any other type of forced movement.

Push and pull can also be added to other abilities as an added effect, allowing the forced movement of one or more targets of that ability after its main effect is resolved. If the ability is an attack, the target can be forced to move even if the attack dealt no damage, but they cannot be forced to move if the attack killed or exhausted them.

Multiple push or pull effects are combined. For example, if an ability with "<img alt="Push Icon" title="Push Icon" src="icons/conditions/fh-push-color-icon.png" class="fh-icon">**1**" gains "<img alt="Push Icon" title="Push Icon" src="icons/conditions/fh-push-color-icon.png" class="fh-icon">**2**," the result is a "<img alt="Push Icon" title="Push Icon" src="icons/conditions/fh-push-color-icon.png" class="fh-icon">**3**" ability.

##### Suffer Damage

Some abilities cause figures to suffer damage without an attack being performed. This damage is not modified by anything except ward and brittle. Suffer damage is not a targeted ability.

##### Loot

<img alt="Loot Icon" title="Loot Icon" src="icons/general/fh-loot-bw-icon.png" width="42">  "**Loot X**" is an ability that allows a figure to loot all loot tokens and treasure tiles within range X, including any in their current hex. This ability is unaffected by the presence of figures or overlay tiles. If there are no loot tokens or treasure tiles within the specified range, the ability cannot be performed.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> When a loot token is looted, it is removed from the map. If the looting figure is a monster, nothing else happens. If the looting figure is a character, they draw one card from the loot deck (unless the loot deck is empty). 
>
> If the loot card provides a random item, the looting character checks off <img alt="Treasure Chest Icon" title="Treasure Chest Icon" src="icons/general/fh-treasure-chest-bw-icon.png" class="fh-icon"> **(x1)** in the scenario entry’s loot table, then draws one card from the random item deck and adds it to their pool of items. They may then use it normally for the remainder of the scenario, even if it puts them above the limit for that type of item. If the random item deck is empty, this card is considered a money card with three coins. If the loot card provides money or resources, the looting character does not gain them until the end of the scenario (see [p.47](#page_47)).

When a treasure tile is looted, it is removed from the map. Monsters cannot loot treasure tiles. If the looted treasure tile is a numbered treasure, reference the treasure’s number in the Treasure Index and apply the effect (see [p.78](#page_78)). Only the looting character gains the reward, unless it is a random item blueprint or random scenario. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If a looting character gains another copy of an item they already own, they must give it to another character or sell it immediately (see [p.67](#page_67)).

<img class="figure" alt="Looting on a hex map. Example: The Banner Spear performs the bottom action of Pincer Movement, which allows them to move and loot the two adjacent hexes." src="figures/p32-loot.webp" width="382" height="315">

<!-- page 33 -->

##### Recover

<img alt="Recover Icon" title="Recover Icon" src="icons/general/fh-recover-card-color-icon.png" width="42">  Recover is a positive non-targeted ability that allows a character to recover discarded or lost ability cards (see [p.38](#page_38)). The recovering character looks through their discard pile or lost pile, selects cards up to the number specified by the ability, and returns those cards to their hand. In some cases, the recover ability might allow a character to recover spent or lost items instead (see [p.36](#page_36)). The recovering character rotates or flips those cards, depending on their usage, so that they can be used again.

##### Commanding Figures

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Commanding figures is a targeted ability that allows a figure to command another figure to perform certain abilities. There are two ways to command figures:
>
> * **Grant:** Allows a figure to grant an ability to any figure. The commanded figure then performs that ability. If the commanded figure is a character summon or scenario ally, the commanding figure decides how the ability is performed.
> * **Control:** Allows a figure to control an ability of an enemy. The commanded figure then performs that ability, and the commanding figure decides how the ability is performed. During this ability, the commanded figure treats the commanding figure’s allies and enemies as their own allies and enemies. When a move ability is controlled, it is considered forced movement.
>
> If an attack ability is granted or controlled, the commanded figure uses their normal attack modifier deck. An attack ability cannot be granted or controlled if the commanded figure has no valid targets or is affected by a negative condition that prevents the attack ability. 
>
> A figure can be commanded to perform a "<img alt="Attack Icon" title="Attack Icon" src="icons/general/fh-attack-bw-icon.png" class="fh-icon"> **X**" or"<img alt="Move Icon" title="Move Icon" src="icons/general/fh-move-bw-icon.png" class="fh-icon"> **X**" ability, even if they have no attack or move stat value. However, a figure cannot be commanded to perform a "<img alt="Attack Icon" title="Attack Icon" src="icons/general/fh-attack-bw-icon.png" class="fh-icon"> **± X**" or "<img alt="Move Icon" title="Move Icon" src="icons/general/fh-move-bw-icon.png" class="fh-icon"> **± X**" ability if they have no attack or move stat value. A commanded figure retains all of their persistent bonuses and special traits. A commanded ability is not considered a separate turn. Objectives cannot be commanded.

##### Manipulating Tiles

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Manipulating tiles is any ability that allows a figure to alter the layout of overlay tiles on the map. There are six ways to manipulate tiles:
> 
> * **Create:** Allows a figure to place an overlay tile.
> * **Destroy:** Allows a figure to remove an overlay tile.
> * **Relocate:** Allows a figure to remove an overlay tile and place it elsewhere.
> * **Move:** Allows a figure to move an overlay tile up to the specified number of hexes, much like a figure would move. Overlay tiles can only be moved through featureless hexes, including occupied hexes.
> * **Replace:** Allows a figure to destroy an overlay tile in order to create a different overlay tile in the same hex.
> * **Spring:** Allows a figure to destroy a trap and apply the effects of the trap to themselves, unless otherwise stated. 
> 
> No hex can have more than one overlay tile in it (except corridors and open doors). Traps and obstacles cannot be placed in or moved into occupied hexes. If hazardous terrain is placed in an occupied hex, its effects are not applied to the figure in that hex. When manipulating obstacles, **figures cannot cut off one area of the map from another,** leaving an area that cannot be entered without going through an obstacle. Figures cannot manipulate any overlay tile that is covering a border hex of a map tile.

<!-- sticker 6 -->

<!-- page 34 -->

#### Character Turns

On a character’s turn, unless performing a long rest (see [p.38](#page_38)), they will perform the top action of one of their played ability cards and the bottom action of the other. They cannot perform two top actions or two bottom actions. They can perform either action first; which card was selected for their initiative no longer matters.

Once played, ability cards can be placed around the sides of the character mat as shown here: discarded ability cards to the left, lost ability cards to the right, and active ability cards above the character mat. Cards in the character’s hand must be kept separate.

<img class="figure" alt="Where to place discarded, lost and active ability cards around the character mat" src="figures/p34-character-mat.webp" width="396" height="285">

##### Character Ability Cards

Character ability cards, which are all unique, determine which actions a character can perform.

A character ability card has the following:

<img class="figure" alt="Ability card features, lettered A to F" src="figures/p34-ability-card.webp" width="408" height="704">

<!-- letters -->

1. **Card Name:** The name of the card.
1. **Initiative Value:** This value determines when the character acts during the round (see [p.19](#page_19)).
1. **Level:** The level of the card. Level X cards are considered level 1 for all purposes.
1. **Actions:** Each card has a top action and a bottom action. The abilities of an action are performed from top to bottom, with each ability separated by an ability line. After the action is performed, the card is placed in the character’s active area, discard pile, or lost pile, depending on the card’s icons. A character may choose not to perform an action, in which case the card is discarded with no effect.
1. **Basic Action** Icons: An ability card can always be used for a basic "<img alt="Attack Icon" title="Attack Icon" src="icons/general/fh-attack-bw-icon.png" class="fh-icon"> **2**" top action or "<img alt="Move Icon" title="Move Icon" src="icons/general/fh-move-bw-icon.png" class="fh-icon"> **2**" bottom action. If a card is used this way, the card is discarded and no other icons or abilities on the card are activated.
1. **Enhancement Marks:** Squares, circles, diamonds, and hexes next to some abilities. Their purpose will be revealed later in the campaign.

<!-- page 35 -->

##### Items

Item cards offer a wide variety of bonuses and extra abilities that can be used in addition to a character’s normal two actions per round. Item cards are acquired by looting them during the Scenario Phase and by purchasing or crafting them during the Outpost Phase.

An item card has the following:

<img class="figure" alt="Item card front and back, lettered A to H" src="figures/p35-item-card.webp" width="405" height="351">

1. **Item Name:** The name of the item.
1. **Item Cost:** The gold cost if it is a purchasable item (see [p.67](#page_67)) 

    > <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> or the crafting cost if it is a craftable item (see [p.65](#page_65)).

<!-- letters -->

1. **Item Usage:** What happens to the item after it has been used (see [p.36](#page_36)). Some items are only spent, while others are lost instead. Some items can even be used multiple times first.
1. **Item Effect:** When the item can be used and what bonus or ability the character gains.
1. **Item Type:** Each item counts as one of six types: <img alt="Head Item Icon" title="Head Item Icon" src="icons/general/fh-equip-slot-head-bw-icon.png" class="fh-icon">, <img alt="Body Item Icon" title="Body Item Icon" src="icons/general/fh-equip-slot-body-bw-icon.png" class="fh-icon">, <img alt="Legs Item Icon" title="Legs Item Icon" src="icons/general/fh-equip-slot-legs-bw-icon.png" class="fh-icon">, <img alt="Single Hand Item Icon" title="Single Hand Item Icon" src="icons/general/fh-equip-slot-single-hand-bw-icon.png" class="fh-icon">, <img alt="Dual Hand Item Icon" title="Dual Hand Item Icon" src="icons/general/fh-equip-slot-dual-hand-bw-icon.png" class="fh-icon">, or <img alt="Small Item Icon" title="Small Item Icon" src="icons/general/fh-equip-slot-item-bw-icon.png" class="fh-icon">. These types determine which items a character can bring into a scenario.
1. **Negative Modifiers:** Some items, when brought into a scenario, add a number of <img alt="-1 Icon" title="-1 Icon" src="icons/attack-modifiers/fh-minus-1-bw-icon.png" class="fh-icon"> cards to the character’s attack modifier deck. For these items, the number of cards to add is shown here.
1. **Quantity:** A count that indicates how many copies of the item exist in the game and which number this copy is within the count.
1. **Index Number:** A unique number that identifies the item. When an item is referenced, using the index icon <img alt="Item Index Icon" title="Item Index Icon" src="icons/general/fh-item-card-bw-icon.png" class="fh-icon">, it can be found by its card back. This prevents the party from inadvertently seeing items they have not discovered yet.

###### Item Limits

All items a character brings into a scenario are placed below their character mat and can be used as specified by the items themselves.

A character can use any item as long as it is in their possession; however, characters can only bring a limited number of items into a scenario. Each character can bring one <img alt="Head Item Icon" title="Head Item Icon" src="icons/general/fh-equip-slot-head-bw-icon.png" class="fh-icon"> item, one <img alt="Body Item Icon" title="Body Item Icon" src="icons/general/fh-equip-slot-body-bw-icon.png" class="fh-icon"> item, one <img alt="Legs Item Icon" title="Legs Item Icon" src="icons/general/fh-equip-slot-legs-bw-icon.png" class="fh-icon"> item, up to two <img alt="Single Hand Item Icon" title="Single Hand Item Icon" src="icons/general/fh-equip-slot-single-hand-bw-icon.png" class="fh-icon"> items -or- one <img alt="Dual Hand Item Icon" title="Dual Hand Item Icon" src="icons/general/fh-equip-slot-dual-hand-bw-icon.png" class="fh-icon"> item, and a number of <img alt="Small Item Icon" title="Small Item Icon" src="icons/general/fh-equip-slot-item-bw-icon.png" class="fh-icon"> items up to half their level (rounded up).

A character can own more items than they bring into a scenario, but they cannot own more than one copy of any single item. All items that a character owns are kept in their tuck box. Different characters cannot own the same copy of the same item. **Items cannot be transferred or traded between characters.**

###### Item Types

|<img alt="Head Item Icon" title="Head Item Icon" src="icons/general/fh-equip-slot-head-bw-icon.png" width="42"> |<img alt="Body Item Icon" title="Body Item Icon" src="icons/general/fh-equip-slot-body-bw-icon.png" width="42"> |<img alt="Legs Item Icon" title="Legs Item Icon" src="icons/general/fh-equip-slot-legs-bw-icon.png" width="42"> |<img alt="Single Hand Item Icon" title="Single Hand Item Icon" src="icons/general/fh-equip-slot-single-hand-bw-icon.png" width="42"> |<img alt="Dual Hand Item Icon" title="Dual Hand Item Icon" src="icons/general/fh-equip-slot-dual-hand-bw-icon.png" width="42"> |<img alt="Small Item Icon" title="Small Item Icon" src="icons/general/fh-equip-slot-item-bw-icon.png" width="42"> |
|:-:|:-:|:-:|:-:|:-:|:-:|
|Head|Body|Feet|One Hand|Two Hands|Small|

<!-- page 36 -->

###### Item Usage

<img alt="Spent Icon" title="Spent Icon" src="icons/general/fh-tap-card-color-icon.png" width="42">  **Spent Icon:** The spent icon means the item is spent after use. This is indicated by rotating the card sideways. Spent items can be recovered the next time the character performs a long rest (see [p.38](#page_38)).

<img alt="Lost Icon" title="Lost Icon" src="icons/general/fh-lost-black-card-color-icon.png" width="42">  **Lost Icon:** The lost icon means the item is lost after use. This is indicated by flipping the card face down. Lost items cannot be used again for the rest of the scenario (unless recovered). If an item has the <img alt="Unrecoverable Icon" title="Unrecoverable Icon" src="icons/general/fh-non-return-card-color-icon.png" class="fh-icon"> icon, it cannot be recovered by any means until the end of the scenario.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> <img alt="Flip Icon" title="Flip Icon" src="icons/general/fh-flip-back-to-front-generic-color-icon.png" width="42">  **Flip Icon:** The flip icon means the item is flipped after use, revealing a different use on the other side of the card. When the other side is used, the item is then flipped over back to its front side to be used again. The specific timing of when to flip the card is detailed in its text. Characters should always start the scenario with these items on the side with the gold cost or crafting cost.

<img class="figure" alt="Item cards showing the spent, lost and flip icons, and an item with no icon" src="figures/p36-item-usage.webp" width="384" height="375">

Some items do not have any of these icons. This means the item applies a passive effect. There is no limit on how many times an item with a passive effect can be used.

Some items can be used multiple times before they are spent, lost, or flipped. This is indicated by a series of use slots on the item. Use a character token to track these uses. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> When an item with multiple uses is recovered, even before it has been fully spent, reset the character token to the first use slot.

Some recover abilities can recover spent or lost items, just like discarded or lost ability cards. All items are returned to their original state between scenarios. No item can ever be permanently lost.

Items with use slots and passive effects must be used if the item’s requirements are met. All other uses of items are optional. The following extra restrictions apply to item use:
* If an item affects an attack (e.g., adds a bonus, an effect, advantage, or disadvantage), it must be used before an attack modifier is drawn.
* If an item provides an ability, it cannot be used during another ability.

<!-- sticker 7 -->

<!-- page 37 -->

##### Mandatory Triggers

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If any part of an action is performed, certain abilities and effects of that action cannot be skipped. In such cases, the ability or effect is highlighted in a box with an "**!**" in front of it. These include:

<img class="figure" alt="Ability cards with mandatory effects, lettered A to E" src="figures/p37-mandatory-triggers.webp" width="384" height="382">

<!-- letters -->

1. > **Negative Abilities:** The indicated ability creates a negative effect for the character or their allies.
1. **Elemental Infusions:** The indicated elements must be infused at the end of the turn.
1. **Experience:** The character must gain the indicated amount of experience.
1. **Lost Icons:** The card must be lost.
1. **Active Icons:** The card must be placed in the character’s active area.

##### Experience

<img alt="Experience Icon" title="Experience Icon" src="icons/general/fh-xp-bw-icon.png" width="42">  Experience measures a character’s growth and defines when they level up. When an action depicts an experience icon <img alt="Experience Icon" title="Experience Icon" src="icons/general/fh-xp-bw-icon.png" class="fh-icon"> in the lower right corner, if any part of that action is performed, the character gains the indicated amount of experience. Experience that a character gains during a scenario is tracked on their blue experience dial.

Sometimes an ability specifies that experience is only gained under certain conditions, such as consuming an element, meeting a requirement, or advancing a character token past an experience icon <img alt="Experience Icon" title="Experience Icon" src="icons/general/fh-xp-bw-icon.png" class="fh-icon"> between use slots.

<img class="figure" alt="A card with conditional experience from an element and from a character token" src="figures/p37-experience.webp" width="405" height="306">

Characters do not automatically gain experience by killing monsters; they must perform specific abilities during a scenario to do so.

##### End-of-Turn Looting

Characters must loot any loot tokens or treasure tiles present in their hex **at the end of their turn.** No figures besides characters perform end-of-turn looting.

<!-- page 38 -->

##### Resting

Resting is the main way that a character can retrieve cards from their discard pile. They have two options when they rest: a short rest or a long rest. In both cases, the rest can only be performed if the character has at least two cards in their discard pile. Resting always results in losing one card from their discard pile.

During the End of Round step (see [p.46](#page_46)), a character may perform a **short rest**. When a character short rests, they lose one random card from their discard pile and return the remaining cards to their hand. If they would like to keep the card that was lost, they can suffer 1 damage to lose a different random card instead, but this can only be done once per short rest.

During the Card Selection step (see [p.18](#page_18)), a character may declare a **long rest**. This constitutes their entire turn for the round, instead of playing two cards, and it is performed on initiative 99. When a character long rests, they follow these steps:

1. Lose one card of their choice from their discard pile and return the remaining cards to their hand (mandatory).
1. Perform "Heal 2, self " (optional).
1. Recover all of their spent items (optional). Items can be used during the same turn in which they are recovered.

##### Lost Actions

<img alt="Lost Icon" title="Lost Icon" src="icons/general/fh-lost-black-card-color-icon.png" width="42">  Lost actions can only be performed once. If an action has the lost icon, when any part of the action is performed, the card must be placed in the character’s lost pile, where it will remain until the end of the scenario (unless recovered).

If the lost action was used to perform an active bonus ability, the card is still considered lost and must be moved from the active area to the lost pile once the active bonus is no longer in effect.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Some lost actions have the <img alt="Unrecoverable Icon" title="Unrecoverable Icon" src="icons/general/fh-non-return-card-color-icon.png" class="fh-icon"> icon. If a character performs an action with this icon, when the card is placed in the lost pile, rotate it 180 degrees so that it is upside down. This card cannot be recovered by any means until the end of the scenario.

##### Character Damage

When a character would suffer any amount of damage 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> (after ward or brittle is applied), 

they must either reduce their red hit point dial by that amount or negate the damage. Damage can be negated in two ways:

<!-- letters -->

1. **Ability or Effect:** The character may use an active ability or effect which negates damage.
1. **Card Loss:** The character may lose one card of their choice from their hand, or two cards of their choice from their discard pile, to negate the damage. If they have not yet taken their turn, the cards they selected during the Card Selection step are not in their hand or discard pile and therefore cannot be lost to negate the damage.

Even if the damage is negated, effects or conditions from the source of damage are still applied.

##### Exhaustion

A  character can become exhausted in two ways:

<!-- letters -->

1. **No Hit Points:** If the character ever reaches zero on their red hit point dial.
1. **No Cards:** If the character does not have at least two cards in their hand (to play) or at least two cards in their discard pile (to rest) at the start of a round. Becoming exhausted this way does not affect their current hit point value.

When a character becomes exhausted, all of their ability cards, including any summons and other cards in their active area, are placed in their lost pile, and their figure is removed from the map. This can even occur in the middle of performing an ability.

Exhausted characters can no longer participate in the scenario in any way, so exhaustion should be avoided at all costs! 

Exhaustion does not reduce the number of characters in the scenario. If all characters become exhausted during a scenario, the scenario is lost.

<!-- page 39 -->

#### Monster Turns

On a monster’s turn, it performs abilities based on the ability card drawn for its monster set. These abilities are determined by a combination of its stat card and the drawn ability card. Monster abilities are automated, following specific guidelines, so that very few decisions about monster behavior need to be made by the party.

<img class="figure" alt="Monster components, and a stat card sliding into its stat sleeve" src="figures/p39-monster-components.webp" width="382" height="510">

##### Monster Stat Cards

Each monster type has a double-sided **monster stat card**, which determines its base stats at every level. To set the level for a monster type, its stat card is inserted in a stat sleeve so that only the relevant stats are shown. Each stat sleeve has a six-section side and a 10-section side. The side to use for a monster type depends on whether that type has four to six standees or 10 standees.

A monster stat card can have the following:

<img class="figure" alt="Monster stat card features, lettered A to I" src="figures/p39-stat-card.webp" width="417" height="450">

<!-- letters -->

1. **Monster Name:** The name of the monster type.
1. **Monster Level:** This level, which matches the scenario level, indicates how to insert the stat card into the stat sleeve.
1. **Monster Rank:** These subsections show stat blocks for normal monsters (left) and elite monsters (right) of this type.
1. **Hit Point Value:** This is the total amount of damage that a monster of this type can suffer before it dies.
1. **Movement Value:** This is the base amount of movement points that a monster of this type gains when performing a move ability.
1. **Attack Value:** This is the base amount of damage that a monster of this type deals when performing an attack ability.
1. **Persistent Bonuses:** These are active bonuses that a monster of this type has for the entire scenario.
1. **Attack Effects:** These are effects that apply to all attack abilities performed by a monster of this type.
1. > <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> **Condition Immunities:** These are conditions that a monster of this type is prevented from gaining due to immunity.

<!-- page 40 -->

##### Monster Ability Cards

Each monster set has a deck of **eight monster ability cards**. After the characters have selected and revealed their ability cards for the round, an ability card is drawn for each monster set with at least one figure currently on the map. This ability card determines when and how the monsters in that set will act during the round.

A monster ability card can have the following:

<img class="figure" alt="Monster ability card front and back, lettered A to E" src="figures/p40-monster-ability-card.webp" width="384" height="279">

<!-- letters -->

1. > <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> **Card Name:** A thematic name for the card.
1. **Initiative Value:** This value determines when the monsters in this set act during the round.
1. **List of Abilities:** This list indicates which abilities the monsters in this set perform on their turns, if possible, and in what order.
1. **Shuffle Icon:** At the end of the round in which a card with the shuffle icon is drawn, the discard pile is shuffled back into the deck.
1. **Set Name:** The name of the monster set is listed on the card back.

**The monsters in a set only perform the abilities listed on the ability card drawn for the current round.** For example, if their ability card does not list a move ability, they will not move. If their ability card does not list an attack ability, they will not attack.

<img class="figure" alt="A monster ability card with no move ability. Example: The Algox Archer ability card Power Shot has no move ability, so Algox Archers will not move this round. They will focus on the closest enemy within range 5 and perform attack +1 against them." src="figures/p40-monster-abilities.webp" width="384" height="328">

Sometimes the rules in this section might not fully clear up ambiguity regarding how a monster should act. In such cases, the party gets to decide the ambiguous choices. This decision does not have to result in what is best for the monster.

> Appendix B provides a concise, illustrated guide for how monsters take their turns (see [p.74](#page_74)).

##### Monster Acting Order

A monster set acts based on the initiative value on the ability card drawn for the current round. During their position in the initiative order, all monsters of the type act, starting with the elite monsters in ascending standee number order, then the normal monsters in ascending standee number order. Each monster completes its turn before the next monster acts.

<img class="figure" alt="Elite and normal monsters acting in standee number order. Example: The Algox Guards are next in the initiative order. The #4 elite monster acts first, followed by the #2 normal monster, then the #5 normal monster." src="figures/p40-acting-order.webp" width="384" height="330">

<!-- page 41 -->

##### Focus

At the start of its turn, a monster finds a focus. This focus is **the enemy it can perform its attack on using the fewest movement points.** 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Determining the shortest possible path takes into consideration the effects of difficult terrain and icy terrain.

For a melee attack, the monster identifies the shortest possible path to a hex from which it can perform the melee attack. For a ranged attack, the monster identifies the shortest possible path to a hex from which it can perform the ranged attack within the specified range. If the monster cannot attack on its turn, either because it does not have an attack ability or because it has disarm, it focuses as if for a single-target melee attack.

If the shortest possible path would bring the monster within range of multiple enemies, it focuses on the one who is closest by range to its current hex. If those enemies are all equally close, it focuses on the one who acts earliest in the initiative order.

<img class="figure" alt="A monster choosing its focus on a hex map. Example: Even though the Algox Guard is closer by range to the Banner Spear, it can perform its melee attack on the Blinkblade using fewer movement points, so it focuses on the Blinkblade." src="figures/p41-focus.webp" width="384" height="438">

###### Additional Foci

If a monster’s attack ability allows it to attack multiple targets, it first finds a primary focus, then finds additional foci for the extra attacks. The monster does this by identifying the shortest possible path to a hex from which it can attack its primary focus and as many additional targets as the attack ability allows during its current turn.

###### Path Priority

Monsters always prioritize a path that triggers the fewest negative hexes, like traps and hazardous terrain, even when that means not maximizing targets. Monsters only trigger negative hexes when there is no other viable path to attack an enemy. For example, if a monster could attack by moving two hexes and springing a trap on the way, or by moving 10 hexes and avoiding the trap, it would take the longer path.

It does not matter whether the monster can actually reach the end of the path on its current turn. As long as there is a path to reach a hex from which to attack an enemy, the monster can focus on that enemy. Focus does not require line-of-sight.

###### No Focus

It is possible that a monster is unable to find a focus if it cannot reach a valid hex, given infinite movement, from which it can perform its attack. In such cases, the monster does not move or attack but still performs any other abilities listed on its ability card.

<!-- page 42 -->

##### Monster Movement

Once a monster has found a focus and identified its path to that focus, it then performs the abilities listed on its ability card in order — the first of which is usually to move. A monster only moves on its turn if "<img alt="Move Icon" title="Move Icon" src="icons/general/fh-move-bw-icon.png" class="fh-icon"> **± X**" is listed on its ability card. This move ability gives the monster an amount of movement points equal to its base move stat (found on its stat card) modified by X (either positive or negative).

A monster always uses the fewest movement points required to maximize its attacks for its current turn. If a monster cannot attack its focus on its current turn, it only moves if it can shorten the path to its focus. When a monster performs a ranged attack on an adjacent target, it first moves away from that target if possible, so that the attack does not have disadvantage. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> When a monster performs ranged attacks on multiple targets, it moves to attack the most possible targets (including its focus), with the fewest possible disadvantaged attacks, while using the fewest possible movement points.

Having abilities other than <img alt="Attack Icon" title="Attack Icon" src="icons/general/fh-attack-bw-icon.png" class="fh-icon"> listed on its ability card does not affect a monster’s movement in any way. It will simply move according to the above rules and then perform its other abilities as fully as possible.

<img class="figure" alt="A monster with no path to any enemy. Example: The Blinkblade is the only character on the map. The Algox Guard cannot find a valid hex from which to perform a melee attack, because all hexes adjacent to the Blinkblade are occupied or invalid, so the Algox Guard cannot find a focus and does not move." src="figures/p42-no-path.webp" width="390" height="243">

<img class="figure" alt="A monster whose path is blocked. Example: The Algox Guard wants to be adjacent to the Blinkblade to perform a melee attack. It has a path to an adjacent hex, but only 1 movement point. Since that cannot bring the Algox Guard closer to its focus, it does not move." src="figures/p42-blocked-path.webp" width="390" height="242">

##### Monster Attacks

A monster only attacks on its turn if "<img alt="Attack Icon" title="Attack Icon" src="icons/general/fh-attack-bw-icon.png" class="fh-icon"> **± X**" is listed on its ability card. This attack ability allows the monster to attack using its base attack stat (found on its stat card) modified by X (either positive or negative).
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> The range of the attack is specified on the ability card. If no range is specified, it is a melee attack. If a monster lists multiple targets as an attack effect on its stat card, the number of targets can be modified by "<img alt="Target Icon" title="Target Icon" src="icons/general/fh-target-bw-icon.png" class="fh-icon"> **± X**" effects.

A monster only attacks its focus (or foci in the case of multiple targets). When its ability card lists multiple attack abilities, a monster can perform all of those attacks on a single focus. If a monster kills or exhausts its focus and still has attacks remaining, it will use the focus rules to find a new focus.

<img class="figure" alt="A ranged monster attack on a hex map. Example: The elite Algox Archer has 2 movement points, but only needs 1 to perform its range 3 attack on either the Geminate or the Boneshaper. So the Algox Archer moves one hex closer and attacks the Geminate, who acts earlier in the initiative order." src="figures/p42-ranged-attack.webp" width="390" height="456">

<!-- page 43 -->

##### Other Monster Abilities

* **Active Bonuses:** Active bonuses from a stat card are active at all times, even if the monster is stunned. Active bonuses from an ability card are only active once the monster has taken its turn, but they remain active until the end of the round, even if the monster is later stunned. Multiple active bonuses, from either type of card, stack with one another as a single effect.

* **Heal Abilities:** The monster heals itself or an ally within the specified range. It always targets the monster within range that has the greatest difference between its current and maximum hit point values.

* **Loot Abilities:** Monsters do not perform end-of-turn looting, unlike characters, but some monsters have loot abilities. In such cases, the monster loots all loot tokens within the specified range, removing them from the map. These loot tokens are not dropped by the monster when it dies. Monsters are unable to loot treasure tiles.

* **Negative Targeted Abilities:** The monster uses the focus rules to find the targets for these abilities as if they were attack abilities, but this does not affect how it moves.

* > <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> **Positive Conditions:** The monster applies the condition to itself or an ally within the specified range. It always targets the monster at the closest range that does not already have the condition. If there is a tie for closest range, it targets the monster that acts earliest in the initiative order.

* **Summon Abilities:** Some monsters can summon other monsters onto the map. Monster summons behave just like other monsters, acting according to the monster ability cards of their set. <br>
A monster summon must be placed in an empty hex adjacent to its summoner and as close to an enemy as possible. If there is no adjacent hex available, or no standee of the corresponding monster type, the figure is not summoned. Monster summons never take a turn during the round in which they are summoned. When a summoner is killed, its monster summons remain on the map.

* > <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> If a monster summon does not have a monster ability card drawn for its set this round, draw one to determine an initiative value solely for the purpose of determining the focus of other figures’ abilities.

##### Monsters and Elements

Monsters can infuse and consume elements.
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> When a monster ability card depicts an infusion or consumption, it triggers if at least one monster of the set performs an ability. 

An infusion occurs when the last monster of the set ends their turn, while a consumption occurs when the first monster of the set starts their turn and benefits every monster of the set.

If any monsters of the same set act later in the initiative order, because they were revealed or spawned, they do not gain the benefit of a previous consumption, but they can consume an element that was infused in the intervening time.

If a monster infuses or consumes a wild or mixed element, the party decides which element is infused or consumed.

<img class="figure" alt="Monster ability cards that infuse fire and consume ice" src="figures/p43-monster-elements.webp" width="382" height="363">

<!-- page 44 -->

##### Revealing and Spawning Monsters

Other than when summoned, monsters can be added to the map in two different ways:

<!-- letters -->

1. **Revealing Monsters:** When the section book indicates that monsters are revealed in a new room, add them to the map immediately, along with any indicated overlay tiles or tokens, as you would when setting up a scenario.
1. **Spawning Monsters:** If the scenario rules indicate that monsters spawn in specific locations at specific times, add them to the map when specified. If a specified location is not empty, place the monster in the closest empty hex instead.

Unlike monsters that have been summoned, monsters that have been revealed or spawned act during the same round in which they were added to the map. If a newly added monster set does not have an ability card drawn for the current round, draw one now.

> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Check the initiative value for the sets of all added monsters. If their initiative value comes after the acting figure’s initiative value, their initiative order token should be in its normal position; they will act in normal initiative order. If their initiative value comes before the acting figure’s initiative value, move or insert their initiative order token after the acting figure’s token; they will act next. When multiple new monster sets would act next, order their tokens based on initiative values.

<img class="figure" alt="A door opening and revealing monsters mid-turn. Example: The Banner Spear uses a move 4 ability at initiative 67 and opens a door after using 2 movement points. As a result, the adjacent room is revealed. First, three Algox Archers must be added to the map, but there are only two standees left, so only two are placed. The Algox Archers in the previous room already acted on initiative 44, but these new Algox Archers will also act this round, so their initiative order token is moved to directly after the Banner Spear’s token. Next, one Snow Imp is added to the map. Because no Snow Imps were in play yet, an ability card must be drawn for the monster set. The card shows initiative 24, so their initiative order token is inserted after the Banner Spear’s token but before the Algox Archer token. Finally, the Banner Spear resumes their turn, using their remaining 2 movement points and any other abilities." src="figures/p44-revealing-monsters.webp" width="390" height="990">

When monsters are added to the map, if there are not enough standees of the right type, place as many monsters as possible, starting with elite monsters, in order of proximity to an enemy. Once the standees run out, do not place the remaining monsters. If there are not enough bases of the right color, place the remaining monsters without bases.

##### Named Monsters

Named monsters are a special class of monster. For some scenarios, the goal is to kill a unique variant of a monster type, which is given a name in the scenario rules. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Place named monster standees in red bases to identify them. 

Named monsters are not considered normal or elite, so they are not affected by abilities that target those ranks. Named monsters act before elites of the same type.

<!-- page 45 -->

##### Bosses

Bosses are a special class of monster. They use a different type of stat card and a special boss ability deck.
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> Place boss standees in red bases to identify them.

Bosses are not considered normal or elite, so they are not affected by abilities that target those ranks. In addition to providing stats, a boss’s stat card describes its special abilities, which are activated by its ability cards. A boss’s stats might refer to "C," which represents the number of characters in the scenario.

If the special abilities of a boss are too complex to fit on its stat card, the scenario rules will provide more information.

<img class="figure" alt="A boss stat card with its parts labelled, and the boss rank on a scenario map" src="figures/p45-boss.webp" width="387" height="465">

##### Monster Damage and Death

When a monster suffers damage, place damage tokens on its stat sleeve in the section corresponding to its standee number. As soon as the total amount of damage suffered by a monster is equal to or greater than its maximum hit point value, it dies.

When a monster dies, remove its standee from the map, clear all tokens from its section of the stat sleeve, and 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> place a loot token in the hex where it died, even if it was summoned or spawned, unless it was a scenario ally. 

No attack effects can be applied to a monster after it dies. If a monster dies while performing one of its own abilities, it cannot perform any other abilities.

<img class="figure" alt="Damage and stun tokens on a stat sleeve. Example: The #3 Algox Guard suffers 1 damage and stun from an attack. As a result, a damage token and a stun token are added to its section of the stat sleeve. The #6 Algox Guard already has 3 damage, suffered from a previous attack." src="figures/p45-monster-damage.webp" width="386" height="519">

###### Kill Credit

Certain battle goals, personal quests, and abilities require characters to track their kills. Summons pass credit for their kills to their summoner.

If a monster dies from damage caused by an attack, retaliate bonus, or suffer damage ability, the figure who caused the damage gets credit for the kill. If a monster dies from damage caused by a negative hex due to forced movement, the figure who caused the forced movement gets credit for the kill.

If a monster dies from damage caused by wound, bane, another monster, or a negative hex due to voluntary movement, no kill credit is given.

<!-- page 46 -->

### End Of Round

After all figures on the map have taken a turn (except figures that were summoned during the round), the End of Round step begins. Perform the following operations in order:

1. Trigger any end-of-round effects in the scenario rules or on items or character ability cards.
1. If any drawn attack modifier card or monster ability card has a shuffle icon, shuffle the corresponding discard pile back into the deck.
1. If any character ability card in a character’s active area has a round bonus, place it in their discard pile or lost pile, depending on whether the action has a lost icon.
1. Any character who has at least two cards in their discard pile may perform a short rest (see [p.38](#page_38)).
1. Move any infused elements one column to the left on the element board, from strong to waning or from waning to inert.

### Common Scenario Rules

* **Allies:** Certain figures are allies of the party. Each ally is represented either by a monster standee, in which case their stats are defined by their monster stat card, or by a numbered scenario aid token, in which case their stats are defined by the scenario rules. When multiple numbered tokens are used to represent allies, randomize them to determine their acting order. Like summons, allies are not controlled by any character, obeying automated monster rules instead. 
> <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> When allies attack, they use the ally attack modifier deck.

* **Equations:** Certain variables, such as hit point values for objectives or named monsters, are determined by equations. These equations can depend on scenario level (L), number of characters (C), or maximum hit point value of an elite monster of the relevant type (H). For example, if a named Polar Bear has (C × H) hit points, then its maximum hit point value is equal to the number of characters multiplied by the maximum hit point value of an elite Polar Bear.

* **Escaping:** Certain scenarios require the party to escape. In these scenarios, certain hexes on the map are designated as escape hexes. If a character ends their turn in an escape hex, they may escape. Their figure is then removed from the map, along with their summons and tokens. Escaped characters can no longer participate in the scenario in any way.

* > <img alt="Frosthaven Identifier" title="Frosthaven Identifier" src="icons/general/fh-frosthaven-identifier-color-icon.png" class="fh-icon new-to-fh-icon"> **Linked Hexes:** Certain hexes on the map are linked to each other. Linked hexes are considered adjacent for the purpose of movement. There is no line-of-sight between linked hexes, but figures can find focus through linked hexes.

* **Locked Doors:** Certain doors are locked at the start of the scenario. Locked doors cannot be opened normally. They act as walls until the specified conditions which unlock them have been met. Once unlocked, they can be opened normally.

* **Round Track:** If a scenario has effects that occur at specific times, the rounds can be tracked via the round track at the top of the element board. Advance the round marker one space at the end of each round.

* **Scenario Aid Tokens:** These numbered or lettered tokens represent allies or loot or even act as reminders for special rules, such as where enemies spawn or when to read a section. These tokens do not affect the empty status of a hex, unless they are representing a figure.

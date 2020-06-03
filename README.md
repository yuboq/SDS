# Bugs/fixes/TODO
- reset enemy on gameover
- refactor the code


# Ideas/game mechanics/Features

## Everyone starts with covid (infection level is hidden from player)
## WASD for movement, arrow keys for direction


## AOE cough cone (based on the infection level)
- range and size of aoe cough are fixed (your infection level doesn't matter)
- effectiveness is determined by your infection level
- your coughs don't affect you (can't stand in your own cough)
- disappears immediately (does not linger)

## % Health decrase based on level of infection -win by last man standing
- globally visible healthbar

## Get med kits to become more healthy (infect health packages, player dropped health packs)
- 3 use health kit: 1st use is covid free, 2nd use is some covid, 3rd use is lots covid
- covid decays on objects, covid increases on humans
- all med kits spawn on game start (change this later)
- gain health + decrease infection (but cannot go to no infection)
- carry medkits (movement speed decrease)


## method for identifing players/computers (overlay/pixel art generator)
- color the circle
- get rid of the orientation line


# Future ideas

- pin camera to yourself/make camera follow player (stage.onviewport)
- Multiplayer (internet/invite system like catan)
- emote system? (super late feature)
- dead players can become ghosts that can place fake med kits/ makes traps
- immune system (health/immune/covid)



const ktx = kaboom({
    width: 1280,
    height: 720,
    scale: 0.7
})

const playerMon = add([
    sprite('player-custom'), // Use a chave 'player-custom' para carregar sua própria imagem
    scale(8),
    pos(-100, 300),
    opacity(1),
    {
        fainted: false
    }
]);

setBackground(Color.fromHex('#36A6E0'))

loadAssets()

scene('world', (worldState) => setWorld(worldState))
scene('battle', (worldState) => setBattle(worldState))  

go('world')
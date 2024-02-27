
export function drawRect(dections, ctx) {
    dections.forEach((predicitons) => {
        const [x, y, width, height] = predicitons['bbox']
        const text = predicitons['class']

        const color = `#${Math.floor(Math.random() * 188288).toString(16)}`
        ctx.strokeStyle = color
        ctx.font = '38px Arial'
        ctx.fillStyle = color

        //draw rectangle
        ctx.beginPath()
        ctx.fillText(text, x, y)
        ctx.rect(x, y, width, height)
        ctx.stroke()
    })
}

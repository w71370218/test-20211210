function loading(scene,w,h) {
    var percentText = scene.make.text({
        x: w / 2,
        y: h / 2 - 5,
        text: 'loading...',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
}
export default loading;
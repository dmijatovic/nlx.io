
const tl = new TimelineMax({
    repeat: -1
})

tl.fromTo(".dashline", 10, {
    strokeDashoffset: (170)
}, {
    strokeDashoffset: 0,
    ease:Linear.easeNone
})

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY
    const illustrationsHeight = document.querySelector('.landing_illustrations').getBoundingClientRect().height;

    if (scrollY > illustrationsHeight) {
        tl.pause()        
    } else {
        tl.play()
    }
})

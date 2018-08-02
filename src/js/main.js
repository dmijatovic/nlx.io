const tl = new TimelineMax({
    repeat: -1
})

tl.fromTo("#dashedlines path", 10, {
    strokeDashoffset: (170)
}, {
    strokeDashoffset: 0,
    ease:Linear.easeNone
})

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY

    const illustrations = document.querySelector('.landing_illustrations')
    if (illustrations) {
        const illustrationsHeight = illustrations.getBoundingClientRect().height;

        if (scrollY > illustrationsHeight) {
            tl.pause()
        } else {
            tl.play()
        }
    }
})

const hoverElements = document.querySelectorAll('[data-highlight]');

Array.from(hoverElements).forEach(hoverElement => {

    const thisId = hoverElement.getAttribute('data-highlight')

    const wrapper = hoverElement.closest('.comparison_side')

    hoverElement.addEventListener('mouseenter', () => {
        wrapper.classList.add(`highlight-${thisId}`)
    })

    hoverElement.addEventListener('mouseleave', () => {
        wrapper.classList.remove(`highlight-${thisId}`)
    })
})

$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover focus manual'
    })
})

const gotoButton = document.querySelector('#goto')
if (gotoButton) {
    gotoButton.onclick = function (e) {
        e.preventDefault()
        scrollToElement(this.getAttribute('href'), 1250)
    }
}

/**
 * ScrollTo utility
 * © https://gist.github.com/james2doyle/5694700
 */
const easeInOutQuad = (t, b, c, d) => {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;

    return -c / 2 * ((--t) * (t - 2) - 1) + b;
};

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (
    () => window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || (callback => window.setTimeout(callback, 1000 / 60))
)();

export function scrollTo(to, duration = 500, callback = null) {
    const move = (amount) => {
        document.documentElement.scrollTop = amount;
        document.body.parentNode.scrollTop = amount;
        document.body.scrollTop = amount;
    };
    const start = document.documentElement.scrollTop ||
        document.body.parentNode.scrollTop ||
        document.body.scrollTop;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
        currentTime += increment;
        const val = easeInOutQuad(currentTime, start, change, duration);
        move(val);
        if (currentTime < duration) {
            requestAnimFrame(animateScroll);
        } else {
            if (callback && typeof (callback) === 'function') {
                callback();
            }
        }
    };
    animateScroll();
}

export function scrollToElement(toSelector, duration = 500) {
    const element = document.querySelector(toSelector);
    if (!element) return;

    scrollTo(element.getBoundingClientRect().top, duration);
}
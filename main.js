// CopyrightⒸ PanDamax
// email: karol.lichon@zsz.bobowa.pl

let th, tbody, informatorParent, p, spanLesson, spanTime, isBreak

let settings = {
	colorBreak: 'red',
	colorLesson: 'aqua',
	colorEnd: 'green'
}

const main = () => {
	prepareDOMElements()
	prepareDOMEvents()
}

const prepareDOMElements = () => {
	informatorParent = document.querySelector('.tytul')
	tbody = document.querySelector('.tabela tbody')
	th = document.querySelectorAll('.g')
	createInformator()
}

const prepareDOMEvents = () => {
	const time = getCurrentTime()

	if (isSchoolTime(time)) {
		const i = findLesson(time)
		setColor(i, time)
		timer(i, time)
	} else {
		p.style.backgroundColor = settings.colorEnd
		p.textContent = 'Brak aktualnie lekcji'
	}
}

const createInformator = () => {
	p = document.createElement('p')
	p.textContent = 'Do końca '

	spanLesson = document.createElement('span')
	spanLesson.classList.add('subject')
	p.appendChild(spanLesson)

	const span = document.createElement('span')
	span.textContent = ' ⮞'
	p.appendChild(span)

	spanTime = document.createElement('span')
	spanTime.classList.add('time')
	p.appendChild(spanTime)

	informatorParent.appendChild(p)
}

const getCurrentTime = () => {
	const now = new Date()
	return {
		day: now.getDay(),
		hour: now.getHours(),
		minute: now.getMinutes(),
	}
}

const findLesson = ({ minute, hour }) => {
	for (let i = 0; i < th.length; i++) {
	  const time = th[i].textContent.match(/(\d+:\d+)\s*-\s*(\d+:\d+)/)
	  const [startHour, startMinute] = time[1].split(':').map(Number)
	  const [endHour, endMinute] = time[2].split(':').map(Number)
  
	  if (
		(hour > startHour || (hour === startHour && minute >= startMinute)) &&
		(hour < endHour || (hour === endHour && minute < endMinute))
	  ) {
		return {i , isBreak: false}
	} else if (
		hour < startHour || (hour === startHour && minute < startMinute)
		) {
		return {i , isBreak: true}
	  }

	}
}

const setColor = ({i, isBreak}, { day }) => {
	if (isBreak) {
		p.style.backgroundColor = settings.colorBreak
		spanLesson.textContent = `przerwy`
		tbody.rows[i].cells[day + 1].style.backgroundColor = settings.colorBreak
	} else {
		p.style.backgroundColor = settings.colorLesson
		spanLesson.textContent = `lekcji ${i}`
		tbody.rows[i + 1].cells[day + 1].style.backgroundColor = settings.colorLesson
		tbody.rows[i].cells[day + 1].style.backgroundColor = ''
	}
}

const timer = ({ i, isBreak }, { minute, hour }) => {
	let remainingMinutes
	const currentTime = hour * 60 + minute
	const time = th[i].textContent.match(/(\d+:\d+)\s*-\s*(\d+:\d+)/)
	
	if (isBreak) {
		const [startHour, startMinute] = time[1].split(':').map(Number)
		const startTime = startHour * 60 + startMinute
		remainingMinutes = startTime - currentTime
	} else {
		const [endHour, endMinute] = time[2].split(':').map(Number)
		const endTime = endHour * 60 + endMinute
		remainingMinutes = endTime - currentTime
	}

	spanTime.textContent = ` ${remainingMinutes}min`
}

function isSchoolTime({ day, hour, minute }) {
    if (day >= 1 && day <= 5) {
        const firstTh = th[0]
        const firstTime = firstTh.textContent.match(/(\d+:\d+)\s*-\s*(\d+:\d+)/)
        const [startHour, startMinute] = firstTime[1].split(':').map(Number)

        const lastTh = th[th.length - 1]
        const lastTime = lastTh.textContent.match(/(\d+:\d+)\s*-\s*(\d+:\d+)/)
        const [endHour, endMinute] = lastTime[2].split(':').map(Number)

        if (
            (hour > startHour || (hour === startHour && minute >= startMinute)) &&
            (hour < endHour || (hour === endHour && minute < endMinute))
        ) {
            return true
        }
    }
    return false
}

document.addEventListener('DOMContentLoaded', main)
setInterval(prepareDOMEvents, 60_000)
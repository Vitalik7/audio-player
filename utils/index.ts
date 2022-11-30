import moment from 'moment'

export const durationToSeconds = (numStart: number, numEnd: number) => {
    // @ts-ignore
    momentDurationFormatSetup(moment)
    const format = (num: number) => {
      return Math.abs(num) < 3600 ? 'm:ss' : 'h:mm:ss'
    }
    let formatStart = format(numStart)
    let formatEnd = format(numEnd)
    return {
      start: moment
        .duration(numStart, 'seconds')
        .format(formatStart, { trim: false }),
      end: moment.duration(numEnd, 'seconds').format(formatEnd, { trim: false }),
    }
  }
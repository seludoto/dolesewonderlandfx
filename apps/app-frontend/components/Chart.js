import { useEffect, useRef } from 'react'
import { createChart, LineSeries } from 'lightweight-charts'

export default function Chart() {
  const chartContainerRef = useRef()

  useEffect(() => {
    if (!chartContainerRef.current) return

    try {
      const chart = createChart(chartContainerRef.current, {
        width: 600,
        height: 300,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#e1e1e1' },
          horzLines: { color: '#e1e1e1' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      })

      const lineSeries = chart.addSeries(LineSeries, {
        color: '#2962FF',
        lineWidth: 2,
      })

      lineSeries.setData([
        { time: '2023-01-01', value: 1.0800 },
        { time: '2023-01-02', value: 1.0850 },
        { time: '2023-01-03', value: 1.0820 },
        { time: '2023-01-04', value: 1.0900 },
      ])

      // Fit content
      chart.timeScale().fitContent()

      return () => {
        chart.remove()
      }
    } catch (error) {
      console.error('Error creating chart:', error)
    }
  }, [])

  return <div ref={chartContainerRef} />
}
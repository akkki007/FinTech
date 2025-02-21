import React from 'react'
import CashFlowChart from '../components/CashFlowCharts'
import TaxEstimator from '../components/TaxEstimator'

const Reports = () => {
  return (
    <div className='flex'>
      <CashFlowChart/>
      <TaxEstimator/>
    </div>
  )
}

export default Reports

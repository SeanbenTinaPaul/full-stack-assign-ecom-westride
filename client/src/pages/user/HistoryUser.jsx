//parent → LayoutUser.jsx
import React from 'react'
import PropTypes from 'prop-types'
import HistoryList from '@/components/userComponent/HistoryList'

function HistoryUser(props) {
  return (
    <div><HistoryList /></div>
  )
}

HistoryUser.propTypes = {}

export default HistoryUser

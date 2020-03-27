import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm'

const mapDispatchToProps = (dispatch, props) => ({
})

const mapStateToProps = (state, props) => {
  return {
    state
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)

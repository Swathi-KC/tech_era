import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CourseItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, courseInfo: {}}

  componentDidMount() {
    this.getCourseInfo()
  }

  getFormattedData = course => ({
    id: course.id,
    name: course.name,
    imageUrl: course.image_url,
    description: course.description,
  })

  getCourseInfo = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.course_details)

      this.setState({
        apiStatus: apiStatusConstants.success,
        courseInfo: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color=" #4656a1" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-head">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.getCourseInfo}>
        Retry
      </button>
    </div>
  )

  renderCourseInfoView = () => {
    const {courseInfo} = this.state
    const {imageUrl, description, name} = courseInfo

    return (
      <div className="course-info-cont">
        <img src={imageUrl} alt={name} className="course-image" />
        <div className="course-content-cont">
          <h1 className="course-name">{name}</h1>
          <p className="course-desc">{description}</p>
        </div>
      </div>
    )
  }

  renderRespectiveCourseInfoView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCourseInfoView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="bg-cont">{this.renderRespectiveCourseInfoView()}</div>
      </>
    )
  }
}

export default CourseItemDetails

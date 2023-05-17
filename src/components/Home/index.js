import {Link} from 'react-router-dom'

import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, courseDetails: []}

  componentDidMount() {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/te/courses'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.courses.map(eachCourse => ({
        id: eachCourse.id,
        name: eachCourse.name,
        logoUrl: eachCourse.logo_url,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        courseDetails: updatedData,
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

  renderCourseDetailsView = () => {
    const {courseDetails} = this.state
    return (
      <>
        <div className="course-details-cont">
          <h1 className="course-details-head">Courses</h1>
          <ul className="course-details-list">
            {courseDetails.map(eachCourse => (
              <li key={eachCourse.id} className="course-details-item">
                <Link to={`/courses/${eachCourse.id}`} className="link-item">
                  <img
                    src={eachCourse.logoUrl}
                    alt={eachCourse.name}
                    className="logo-img"
                  />
                  <p className="course-name">{eachCourse.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

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
      <button
        type="button"
        className="retry-btn"
        onClick={this.getCourseDetails}
      >
        Retry
      </button>
    </div>
  )

  renderRespectiveCourseDetailsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCourseDetailsView()
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
        <div className="bg-cont">
          {this.renderRespectiveCourseDetailsView()}
        </div>
      </>
    )
  }
}

export default Home

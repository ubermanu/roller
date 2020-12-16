import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import defaults from './defaultOptions'
import 'bulma/css/bulma.min.css';
import './optionsPage.css'

function OptionsPage() {
    const [formData, setFormData] = useState(defaults)

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        // TODO: Update config in chrome local storage
    }

    return (
        <main className="container">
            <section className="section">
                <h2 className="title is-5">Basic</h2>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="stickyScroll"
                                defaultChecked={formData.stickyScroll}
                                onChange={handleChange}
                            />{' '}
                            Scroll without holding down the mouse button
                        </label>
                    </div>
                    <div className="control">
                        ...if moving less than{' '}
                        <input
                            type="text"
                            className="is-small"
                            name="moveThreshold"
                            defaultValue={formData.moveThreshold}
                            onChange={handleChange}
                        />{' '}
                        pixels
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        Scroll if moving more than{' '}
                        <input
                            type="text"
                            className="is-small"
                            name="dragThreshold"
                            defaultValue={formData.dragThreshold}
                            onChange={handleChange}
                        />{' '}
                        pixels
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="middleClick"
                                defaultChecked={formData.middleClick}
                                onChange={handleChange}
                            />{' '}
                            Scroll by using (Middle Click)
                        </label>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="ctrlClick"
                                defaultChecked={formData.ctrlClick}
                                onChange={handleChange}
                            />{' '}
                            Scroll by using (Ctrl/⌘ + Left Click)
                        </label>
                    </div>
                </div>
            </section>
            <section className="section">
                <h2 className="title is-5">Speed</h2>
                <div className="field">
                    <div className="control">
                        Move speed:{' '}
                        <input
                            type="text"
                            className="is-small"
                            name="moveSpeed"
                            defaultValue={formData.moveSpeed}
                            onChange={handleChange}
                        />{' '}
                        (lower is faster)
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="sameSpeed"
                                defaultValue={formData.sameSpeed}
                                onChange={handleChange}
                            />{' '}
                            Scroll at the same speed (ignore mouse movement)
                        </label>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="shouldCap"
                                defaultChecked={formData.shouldCap}
                                onChange={handleChange}
                            />{' '}
                            Don't scroll faster than{' '}
                            <input
                                type="text"
                                className="is-small"
                                name="capSpeed"
                                defaultValue={formData.capSpeed}
                                onChange={handleChange}
                            />{' '}
                            pixels
                        </label>
                    </div>
                </div>
            </section>
            <section className="section">
                <h2 className="title is-5">Advanced</h2>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="innerScroll"
                                defaultChecked={formData.innerScroll}
                                onChange={handleChange}
                            />{' '}
                            Scroll on inner elements
                        </label>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input
                                type="checkbox"
                                name="scrollOnLinks"
                                defaultChecked={formData.scrollOnLinks}
                                onChange={handleChange}
                            />{' '}
                            Scroll when clicking on a link or textarea
                        </label>
                    </div>
                </div>
            </section>
        </main>
    )
}

ReactDOM.render(<OptionsPage />, document.getElementById('root'))

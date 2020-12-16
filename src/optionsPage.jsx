import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import defaults from './defaultOptions'
import 'bulma/css/bulma.min.css'
import './optionsPage.css'

function OptionsPage() {
    const [formData, setFormData] = useState(defaults)

    useEffect(() => {
        chrome.storage.local.get(defaults, (options) => {
            setFormData(options)
        })
    }, [])

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        chrome.storage.local.set(formData)
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
                                checked={formData.stickyScroll}
                                onChange={handleChange}
                            />{' '}
                            Scroll without holding down the mouse button
                        </label>
                    </div>
                    <div className="control">
                        ...if moving less than{' '}
                        <input
                            type="number"
                            className="input is-small"
                            name="moveThreshold"
                            value={formData.moveThreshold}
                            onChange={handleChange}
                        />{' '}
                        pixels
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        Scroll if moving more than{' '}
                        <input
                            type="number"
                            className="input is-small"
                            name="dragThreshold"
                            value={formData.dragThreshold}
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
                                checked={formData.middleClick}
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
                                checked={formData.ctrlClick}
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
                            type="number"
                            className="input is-small"
                            name="moveSpeed"
                            value={formData.moveSpeed}
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
                                value={formData.sameSpeed}
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
                                checked={formData.shouldCap}
                                onChange={handleChange}
                            />{' '}
                            Don't scroll faster than{' '}
                            <input
                                type="number"
                                className="input is-small"
                                name="capSpeed"
                                value={formData.capSpeed}
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
                                checked={formData.innerScroll}
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
                                checked={formData.scrollOnLinks}
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

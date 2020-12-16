import React from 'react'
import ReactDOM from 'react-dom'
import defaults from '../defaultOptions'
import 'bulma/css/bulma.min.css'
import './options.css'

// TODO: Restore options listener
function getOpts(f) {
    // chrome.storage.local.get(defaults, function (options) {
    //     var opts = {}
    //
    //     for (var s in options) {
    //         opts[s] = (function (s) {
    //             return cell.dedupe(options[s], {
    //                 set: function (self, x) {
    //                     if (x === defaults[s]) {
    //                         chrome.storage.local.remove(s)
    //                     } else {
    //                         var o = {}
    //                         o[s] = x
    //                         chrome.storage.local.set(o)
    //                     }
    //                 },
    //             })
    //         })(s)
    //     }
    //
    //     chrome.storage.onChanged.addListener(function (o, s) {
    //         console.assert(s === 'local')
    //         for (var k in o) {
    //             var x = o[k]
    //             if ('newValue' in x) {
    //                 opts[k].set(x.newValue)
    //             } else if ('oldValue' in x) {
    //                 opts[k].set(defaults[k])
    //             }
    //         }
    //     })
    //
    //     f(opts)
    // })
}

function OptionsPage() {
    return (
        <main className="container">
            <section className="section">
                <h2 className="title is-5">Basic</h2>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input type="checkbox" /> Scroll without holding
                            down the mouse button
                        </label>
                    </div>
                    <div className="control">
                        ...if moving less than{' '}
                        <input type="text" className="is-small" /> pixels
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        Scroll if moving more than{' '}
                        <input type="text" className="is-small" /> pixels
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input type="checkbox" /> Scroll by using (Middle
                            Click)
                        </label>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input type="checkbox" /> Scroll by using (Ctrl/⌘ +
                            Left Click)
                        </label>
                    </div>
                </div>
            </section>
            <section className="section">
                <h2 className="title is-5">Speed</h2>
                <div className="field">
                    <div className="control">
                        Move speed: <input type="text" className="is-small" />{' '}
                        (lower is faster)
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input type="checkbox" /> Scroll at the same speed
                            (ignore mouse movement)
                        </label>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input type="checkbox" /> Don't scroll faster than{' '}
                            <input type="text" className="is-small" /> pixels
                        </label>
                    </div>
                </div>
            </section>
            <section className="section">
                <h2 className="title is-5">Advanced</h2>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input type="checkbox" /> Scroll on inner elements
                        </label>
                    </div>
                </div>
                <div className="field">
                    <div className="control">
                        <label className="checkbox">
                            <input type="checkbox" /> Scroll when clicking on a
                            link or textarea
                        </label>
                    </div>
                </div>
            </section>
        </main>
    )
}

ReactDOM.render(<OptionsPage />, document.getElementById('root'))

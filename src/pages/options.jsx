import React from 'react'
import ReactDOM from 'react-dom'
import defaults from '../defaultOptions'
import 'bulma/css/bulma.min.css'

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
        <main>
            <section>
                <h2>Basic</h2>
                <div className="field">
                    <input type="checkbox" />
                    <label htmlFor="">
                        Scroll without holding down the mouse button
                    </label>
                </div>
                <div className="field">
                    ...if moving less than{' '}
                    <input type="text" className="is-small" /> pixels
                </div>
                <div className="field">
                    <input type="checkbox" />
                    <label htmlFor="">
                        Scroll without holding down the mouse button
                    </label>
                </div>
                <div className="field">
                    <input type="checkbox" />
                    <label htmlFor="">
                        Scroll by using (Ctrl/⌘ + Left Click)
                    </label>
                </div>
            </section>
            <section>
                <h2>Speed</h2>
                <div className="field">
                    Move speed: <input type="text" className="is-small" />{' '}
                    (lower is faster)
                </div>
                <div className="field">
                    <input type="checkbox" />
                    <label htmlFor="">
                        Scroll at the same speed (ignore mouse movement)
                    </label>
                </div>
                <div className="field">
                    <input type="checkbox" />
                    <label htmlFor="">
                        Don't scroll faster than{' '}
                        <input type="text" className="is-small" /> pixels
                    </label>
                </div>
            </section>
            <section>
                <h2>Advanced</h2>
                <div className="field">
                    <input type="checkbox" />
                    <label htmlFor="">Scroll on inner elements</label>
                </div>
                <div className="field">
                    <input type="checkbox" />
                    <label htmlFor="">
                        Scroll when clicking on a link or textarea
                    </label>
                </div>
            </section>
        </main>
    )
}

ReactDOM.render(<OptionsPage />, document.getElementById('root'))

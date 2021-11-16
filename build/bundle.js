
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    // Search for an Item (either a show or movie title) in a locale/country (ex. "en_US" for USA)
    async function search_for_item(query, country) {
        const url = `https://warm-coast-72718.herokuapp.com/https://apis.justwatch.com/content/titles/${country}/popular`;
        const body = {
            "query": query,
        };
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                "X-Requested-With": "fetch"
            }
        });
        if (response.ok == false)
            throw new Error("Http Error: " + response.status);
        return await response.json();
    }
    // Returns raw JSON information on every locale supported by JustWatch
    async function get_locales() {
        const url = "https://warm-coast-72718.herokuapp.com/https://apis.justwatch.com/content/locales/state";
        const response = await fetch(url, {
            headers: { "X-Requested-With": "fetch" }
        });
        if (response.ok == false)
            throw new Error("Http Error: " + response.status);
        return await response.json();
    }
    class Locale {
        constructor(country, full_locale) {
            this.country = country;
            this.full_locale = full_locale;
        }
    }
    /*
    Returns the usable information about every JustWatch supported locale,
    the property for key 'full_locale' is the one usable for API requests.
    ex. en_US
    */
    async function get_all_locales() {
        const locales = await get_locales();
        var all_locales = [];
        locales.forEach((i) => {
            var l = new Locale(i.country, i.full_locale);
            all_locales.push(l);
        });
        return all_locales;
    }
    // Returns JSON data on every provider JustWatch has data on for a given locale/country
    async function get_providers(country) {
        const url = `https://warm-coast-72718.herokuapp.com/https://apis.justwatch.com/content/providers/locale/${country}`;
        const response = await fetch(url, {
            headers: { "X-Requested-With": "fetch" }
        });
        if (response.ok == false)
            throw new Error("Http Error: " + response.status);
        return response.json();
    }
    // Returns the JSON data on every single provider JustWath has data on for every country
    async function get_all_providers() {
        const locale_list = await get_all_locales();
        var providers_array = [];
        var promise = locale_list.map(async (locale) => {
            var r = await get_providers(locale.full_locale);
            var provider = {
                country: locale.country,
                providers: r
            };
            providers_array.push(provider);
        });
        await Promise.all(promise);
        return providers_array;
    }
    /*
    Returns JustWatch's data for a given show or movie for a given locale.
    content_type is either "show" or "movie"
    */
    async function get_title_from_id(title_id, country, content_type) {
        const url = `https://warm-coast-72718.herokuapp.com/https://apis.justwatch.com/content/titles/${content_type}/${title_id}/locale/${country}`;
        const response = await fetch(url, {
            headers: { "X-Requested-With": "fetch" }
        });
        if (response.ok == false)
            throw new Error("Http Error: " + response.status);
        return response.json();
    }
    class IDSearch {
        constructor(title, id, poster_uri, type, release_year, query_locale) {
            this.title = title;
            this.id = id;
            this.poster_uri = poster_uri;
            this.type = type;
            this.release_year = release_year;
            this.query_locale = query_locale;
        }
    }
    // Returns the most useful data from a search query as an array of IDSearch objects.
    // IDSearch's properties are the title of the movie or show, JustWatch's id for that movie or show, 
    // the URL of that movie or show's poster, the type (show or movie), the release year, and the Locale 
    // object used to make the search
    async function search_for_item_id(query, locale) {
        const r = await search_for_item(query, locale.full_locale);
        var titles = [];
        r["items"].forEach((i) => {
            let regex = new RegExp("\\s*([0-9]+)");
            var regex_match = regex.exec(i["poster"]);
            var poster_uri;
            if (regex_match == null) {
                poster_uri = "NULL";
            }
            else {
                poster_uri = `https://images.justwatch.com/poster/${regex_match[0]}/s592/poster.webp`;
            }
            titles.push(new IDSearch(i["title"], i["id"], poster_uri, i["object_type"], i["original_release_year"], locale));
        });
        return titles;
    }

    /* src/Loading.svelte generated by Svelte v3.44.1 */

    const file$4 = "src/Loading.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let span0;
    	let h1;
    	let t1;
    	let span1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			span0 = element("span");
    			h1 = element("h1");
    			h1.textContent = "Loading...";
    			t1 = space();
    			span1 = element("span");
    			div0 = element("div");
    			attr_dev(h1, "class", "svelte-152oh3b");
    			add_location(h1, file$4, 2, 4, 44);
    			attr_dev(span0, "class", "svelte-152oh3b");
    			add_location(span0, file$4, 1, 2, 33);
    			attr_dev(div0, "class", "loader svelte-152oh3b");
    			add_location(div0, file$4, 5, 4, 87);
    			attr_dev(span1, "class", "svelte-152oh3b");
    			add_location(span1, file$4, 4, 2, 76);
    			set_style(div1, "margin-top", "8rem");
    			add_location(div1, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, span0);
    			append_dev(span0, h1);
    			append_dev(div1, t1);
    			append_dev(div1, span1);
    			append_dev(span1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Search.svelte generated by Svelte v3.44.1 */
    const file$3 = "src/Search.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (24:0) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 4,
    		blocks: [,,,]
    	};

    	handle_promise(/*locales*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			div = element("div");
    			info.block.c();
    			attr_dev(div, "class", "class svelte-1u487dq");
    			add_location(div, file$3, 24, 2, 522);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			info.block.m(div, info.anchor = null);
    			info.mount = () => div;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(24:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:0) {#if submitted}
    function create_if_block$2(ctx) {
    	let app;
    	let current;

    	app = new App({
    			props: {
    				page: "SearchResults",
    				search: "" + (/*query*/ ctx[0] + ","),
    				locale: JSON.parse(/*selected_locale*/ ctx[1])
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(app.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(app, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const app_changes = {};
    			if (dirty & /*query*/ 1) app_changes.search = "" + (/*query*/ ctx[0] + ",");
    			if (dirty & /*selected_locale*/ 2) app_changes.locale = JSON.parse(/*selected_locale*/ ctx[1]);
    			app.$set(app_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(app.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(app.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(app, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(18:0) {#if submitted}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">import App from "./App.svelte"; import { get_all_locales }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import App from \\\"./App.svelte\\\"; import { get_all_locales }",
    		ctx
    	});

    	return block;
    }

    // (28:4) {:then locales}
    function create_then_block$3(ctx) {
    	let div0;
    	let t0;
    	let div2;
    	let h1;
    	let t2;
    	let h3;
    	let t4;
    	let div1;
    	let form;
    	let input0;
    	let t5;
    	let select;
    	let t6;
    	let input1;
    	let mounted;
    	let dispose;
    	let each_value = /*locales*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Global Streaming Search";
    			t2 = space();
    			h3 = element("h3");
    			h3.textContent = "Search for a movie or TV show title and see what streaming services\n          offer it worldwide!";
    			t4 = space();
    			div1 = element("div");
    			form = element("form");
    			input0 = element("input");
    			t5 = space();
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			input1 = element("input");
    			attr_dev(div0, "class", "background svelte-1u487dq");
    			add_location(div0, file$3, 28, 6, 607);
    			attr_dev(h1, "class", "svelte-1u487dq");
    			add_location(h1, file$3, 30, 8, 666);
    			attr_dev(h3, "class", "svelte-1u487dq");
    			add_location(h3, file$3, 31, 8, 707);
    			attr_dev(input0, "class", "search svelte-1u487dq");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Title");
    			add_location(input0, file$3, 37, 12, 944);
    			attr_dev(select, "class", "search svelte-1u487dq");
    			if (/*selected_locale*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[6].call(select));
    			add_location(select, file$3, 43, 12, 1100);
    			attr_dev(input1, "type", "submit");
    			attr_dev(input1, "class", "search svelte-1u487dq");
    			add_location(input1, file$3, 50, 12, 1369);
    			add_location(form, file$3, 36, 10, 889);
    			set_style(div1, "display", "inline-block");
    			add_location(div1, file$3, 35, 8, 842);
    			attr_dev(div2, "class", "top svelte-1u487dq");
    			add_location(div2, file$3, 29, 6, 640);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t2);
    			append_dev(div2, h3);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, form);
    			append_dev(form, input0);
    			set_input_value(input0, /*query*/ ctx[0]);
    			append_dev(form, t5);
    			append_dev(form, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*selected_locale*/ ctx[1]);
    			append_dev(form, t6);
    			append_dev(form, input1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[6]),
    					listen_dev(form, "submit", prevent_default(/*onSubmit*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*query*/ 1 && input0.value !== /*query*/ ctx[0]) {
    				set_input_value(input0, /*query*/ ctx[0]);
    			}

    			if (dirty & /*JSON, locales*/ 16) {
    				each_value = /*locales*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*selected_locale, JSON, locales*/ 18) {
    				select_option(select, /*selected_locale*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(28:4) {:then locales}",
    		ctx
    	});

    	return block;
    }

    // (45:14) {#each locales as locale}
    function create_each_block$2(ctx) {
    	let option;
    	let t_value = /*locale*/ ctx[7]["country"] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = JSON.stringify(/*locale*/ ctx[7]);
    			option.value = option.__value;
    			add_location(option, file$3, 45, 16, 1209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(45:14) {#each locales as locale}",
    		ctx
    	});

    	return block;
    }

    // (26:20)        <Loading />     {:then locales}
    function create_pending_block$3(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(26:20)        <Loading />     {:then locales}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*submitted*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	let query;
    	let locales = get_all_locales();
    	let selected_locale;
    	let submitted = false;

    	function onSubmit() {
    		if (query != undefined) {
    			$$invalidate(2, submitted = true);
    		} else {
    			alert("Please input a valid title.");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		query = this.value;
    		$$invalidate(0, query);
    	}

    	function select_change_handler() {
    		selected_locale = select_value(this);
    		$$invalidate(1, selected_locale);
    		$$invalidate(4, locales);
    	}

    	$$self.$capture_state = () => ({
    		App,
    		get_all_locales,
    		Loading,
    		query,
    		locales,
    		selected_locale,
    		submitted,
    		onSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('query' in $$props) $$invalidate(0, query = $$props.query);
    		if ('locales' in $$props) $$invalidate(4, locales = $$props.locales);
    		if ('selected_locale' in $$props) $$invalidate(1, selected_locale = $$props.selected_locale);
    		if ('submitted' in $$props) $$invalidate(2, submitted = $$props.submitted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		query,
    		selected_locale,
    		submitted,
    		onSubmit,
    		locales,
    		input0_input_handler,
    		select_change_handler
    	];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    async function search(query, locale) {
        return await search_for_item_id(query, locale);
    }
    class TVOrMovie extends IDSearch {
        constructor(is, short_description, number_seasons, backdrop_url, offers) {
            super(is.title, is.id, is.poster_uri, is.type, is.release_year, is.query_locale);
            this.short_description = short_description;
            this.number_seasons = number_seasons;
            this.backdrop_url = backdrop_url;
            this.offers = offers;
        }
    }
    async function get_all_info_from_id(search, providers) {
        console.time("test");
        const locales = await get_all_locales();
        let country_info = [];
        var append_country_info = locales.map(async (i) => {
            let r = await get_title_from_id(search.id, i.full_locale, search.type);
            country_info.push({ country: i.country, info: r });
        });
        await Promise.all(append_country_info);
        let home = country_info.filter((obj) => {
            return obj.country === search.query_locale.country;
        });
        home = home[0].info;
        let short_description = home["short_description"];
        // Gets the backdrop url.
        let regex = new RegExp("\\s*([0-9]+)");
        let regex_match = regex.exec(home["backdrops"][0]["backdrop_url"]);
        let backdrop_url = (regex_match != null) ? `https://images.justwatch.com/backdrop/${regex_match[0]}/s1920/backdrop.webp` : "NULL";
        let seasons = ("seasons" in home) ? home["seasons"] : "NULL";
        let offers = [];
        var append_offers = country_info.map(async (i) => {
            let country = i.country;
            i = i.info;
            if ("offers" in i) {
                let os = [];
                var append_os = i["offers"].map(async (i) => {
                    if (i["monitization_types"] == "flatrate" || "ads" || "free") {
                        providers.forEach(provider => {
                            if (i.provider_id == provider.id) {
                                os.push({
                                    id: provider.id,
                                    short_name: provider.short_name,
                                    clear_name: provider.clear_name,
                                    icon_uri: provider.icon_uri,
                                    monetization_types: provider.monetization_types,
                                    url: i["urls"]["standard_web"]
                                });
                            }
                        });
                    }
                });
                await Promise.all(append_os);
                offers.push({
                    country: country,
                    offers: os
                });
            }
        });
        await Promise.all(append_offers);
        console.timeEnd("test");
        return new TVOrMovie(search, short_description, seasons, backdrop_url, offers);
    }
    class Provider {
        constructor(id, short_name, clear_name, icon_uri, monetization_types) {
            this.id = id;
            this.short_name = short_name;
            this.clear_name = clear_name;
            this.icon_uri = icon_uri;
            this.monetization_types = monetization_types;
        }
    }
    async function distilled_providers() {
        var p = await get_all_providers();
        var providers = [];
        var extract_country = p.map(async (i) => {
            i["providers"].forEach((i) => {
                if (i["monetization_types"].includes("flatrate") || i["monetization_types"].includes("free") || i["monetization_types"].includes("ads")) {
                    var monetization_types = i["monetization_types"];
                    let regex = new RegExp("\\s*([0-9]+)");
                    var regex_match = regex.exec(i["icon_url"]);
                    let icon_uri = (regex_match != null) ? `https://www.justwatch.com/images/icon/${regex_match[0]}/s100/icon.webp` : "NULL";
                    providers.push(new Provider(i["id"], i["short_name"], i["clear_name"], icon_uri, monetization_types));
                }
            });
        });
        await Promise.all(extract_country);
        const unique = [...new Map(providers.map((item) => [item["id"], item])).values()];
        return unique;
    }

    /* src/SearchResults.svelte generated by Svelte v3.44.1 */
    const file$2 = "src/SearchResults.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (20:0) {:else}
    function create_else_block(ctx) {
    	let h2;
    	let t0;
    	let span;
    	let t1;
    	let t2;
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 4,
    		blocks: [,,,]
    	};

    	handle_promise(/*search_results*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text("Results for ");
    			span = element("span");
    			t1 = text(/*query*/ ctx[0]);
    			t2 = space();
    			await_block_anchor = empty();
    			info.block.c();
    			set_style(span, "color", "red");
    			add_location(span, file$2, 21, 16, 593);
    			set_style(h2, "color", "white");
    			set_style(h2, "text-align", "center");
    			add_location(h2, file$2, 20, 2, 530);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			append_dev(h2, span);
    			append_dev(span, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*query*/ 1) set_data_dev(t1, /*query*/ ctx[0]);
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(20:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:0) {#if selected}
    function create_if_block$1(ctx) {
    	let app;
    	let current;

    	app = new App({
    			props: {
    				page: "Selection",
    				selection: /*selection*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(app.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(app, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const app_changes = {};
    			if (dirty & /*selection*/ 4) app_changes.selection = /*selection*/ ctx[2];
    			app.$set(app_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(app.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(app.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(app, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(18:0) {#if selected}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">import Loading from "./Loading.svelte"; import App from "./App.svelte"; import { search }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import Loading from \\\"./Loading.svelte\\\"; import App from \\\"./App.svelte\\\"; import { search }",
    		ctx
    	});

    	return block;
    }

    // (26:2) {:then search_results}
    function create_then_block$2(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*search_results*/ ctx[4].length > 0) return create_if_block_1$1;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(26:2) {:then search_results}",
    		ctx
    	});

    	return block;
    }

    // (54:4) {:else}
    function create_else_block_2(ctx) {
    	let span;
    	let h1;
    	let t1;
    	let h2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			h1 = element("h1");
    			h1.textContent = "No results 😭";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "please reload the page and try a different title.";
    			add_location(h1, file$2, 55, 8, 1759);
    			add_location(h2, file$2, 56, 8, 1790);
    			set_style(span, "color", "white");
    			set_style(span, "text-align", "center");
    			add_location(span, file$2, 54, 6, 1702);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, h1);
    			append_dev(span, t1);
    			append_dev(span, h2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(54:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#if search_results.length > 0}
    function create_if_block_1$1(ctx) {
    	let div;
    	let each_value = /*search_results*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "results svelte-1rudybt");
    			add_location(div, file$2, 27, 6, 750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*select, search_results*/ 24) {
    				each_value = /*search_results*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(27:4) {#if search_results.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (39:14) {:else}
    function create_else_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/noImage.webp")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "No image found for the " + /*result*/ ctx[7]['type'] + " " + /*result*/ ctx[7]['title']);
    			attr_dev(img, "class", "svelte-1rudybt");
    			add_location(img, file$2, 39, 16, 1220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(39:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:14) {#if result["poster_uri"] != "NULL"}
    function create_if_block_2$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*result*/ ctx[7]["poster_uri"])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Poster for the " + /*result*/ ctx[7]['type'] + " " + /*result*/ ctx[7]['title']);
    			attr_dev(img, "class", "svelte-1rudybt");
    			add_location(img, file$2, 34, 16, 1043);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(34:14) {#if result[\\\"poster_uri\\\"] != \\\"NULL\\\"}",
    		ctx
    	});

    	return block;
    }

    // (29:8) {#each search_results as result}
    function create_each_block$1(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let span;
    	let h2;
    	let t1_value = /*result*/ ctx[7]["title"] + "";
    	let t1;
    	let t2;
    	let h40;
    	let t3;
    	let t4_value = /*result*/ ctx[7]["release_year"] + "";
    	let t4;
    	let t5;
    	let t6;
    	let h41;
    	let t7_value = /*result*/ ctx[7]["type"] + "";
    	let t7;
    	let t8;
    	let mounted;
    	let dispose;

    	function select_block_type_2(ctx, dirty) {
    		if (/*result*/ ctx[7]["poster_uri"] != "NULL") return create_if_block_2$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*result*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			span = element("span");
    			h2 = element("h2");
    			t1 = text(t1_value);
    			t2 = space();
    			h40 = element("h4");
    			t3 = text("(");
    			t4 = text(t4_value);
    			t5 = text(")");
    			t6 = space();
    			h41 = element("h4");
    			t7 = text(t7_value);
    			t8 = space();
    			add_location(h2, file$2, 45, 16, 1476);
    			add_location(h40, file$2, 46, 16, 1519);
    			add_location(h41, file$2, 47, 16, 1571);
    			attr_dev(span, "class", "resultinfo svelte-1rudybt");
    			add_location(span, file$2, 44, 14, 1402);
    			attr_dev(div0, "class", "result svelte-1rudybt");
    			add_location(div0, file$2, 32, 12, 955);
    			set_style(div1, "display", "inline-block");
    			set_style(div1, "margin-left", "2rem");
    			set_style(div1, "margin-right", "2rem");
    			set_style(div1, "margin-bottom", "2rem");
    			add_location(div1, file$2, 29, 10, 823);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if_block.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			append_dev(span, h2);
    			append_dev(h2, t1);
    			append_dev(span, t2);
    			append_dev(span, h40);
    			append_dev(h40, t3);
    			append_dev(h40, t4);
    			append_dev(h40, t5);
    			append_dev(span, t6);
    			append_dev(span, h41);
    			append_dev(h41, t7);
    			append_dev(div1, t8);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(29:8) {#each search_results as result}",
    		ctx
    	});

    	return block;
    }

    // (24:25)      <Loading/>   {:then search_results}
    function create_pending_block$2(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(24:25)      <Loading/>   {:then search_results}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selected*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchResults', slots, []);
    	let { query } = $$props;
    	let { locale } = $$props;

    	// not sure why here is randomly 2 commas that sometimes appear
    	// on my query so frick em.
    	query = query.replace(",,", "");

    	let search_results = search(query, locale);
    	let selected = false;
    	let selection;

    	function select(r) {
    		$$invalidate(1, selected = true);
    		$$invalidate(2, selection = JSON.stringify(r));
    	}

    	const writable_props = ['query', 'locale'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchResults> was created with unknown prop '${key}'`);
    	});

    	const click_handler = result => select(result);

    	$$self.$$set = $$props => {
    		if ('query' in $$props) $$invalidate(0, query = $$props.query);
    		if ('locale' in $$props) $$invalidate(5, locale = $$props.locale);
    	};

    	$$self.$capture_state = () => ({
    		Loading,
    		App,
    		search,
    		query,
    		locale,
    		search_results,
    		selected,
    		selection,
    		select
    	});

    	$$self.$inject_state = $$props => {
    		if ('query' in $$props) $$invalidate(0, query = $$props.query);
    		if ('locale' in $$props) $$invalidate(5, locale = $$props.locale);
    		if ('search_results' in $$props) $$invalidate(4, search_results = $$props.search_results);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('selection' in $$props) $$invalidate(2, selection = $$props.selection);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [query, selected, selection, select, search_results, locale, click_handler];
    }

    class SearchResults extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { query: 0, locale: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchResults",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*query*/ ctx[0] === undefined && !('query' in props)) {
    			console.warn("<SearchResults> was created without expected prop 'query'");
    		}

    		if (/*locale*/ ctx[5] === undefined && !('locale' in props)) {
    			console.warn("<SearchResults> was created without expected prop 'locale'");
    		}
    	}

    	get query() {
    		throw new Error("<SearchResults>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set query(value) {
    		throw new Error("<SearchResults>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get locale() {
    		throw new Error("<SearchResults>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locale(value) {
    		throw new Error("<SearchResults>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Selection.svelte generated by Svelte v3.44.1 */
    const file$1 = "src/Selection.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (1:0) <script lang="ts">import Loading from "./Loading.svelte"; import { get_all_info_from_id }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import Loading from \\\"./Loading.svelte\\\"; import { get_all_info_from_id }",
    		ctx
    	});

    	return block;
    }

    // (11:0) {:then titles}
    function create_then_block$1(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div3;
    	let div2;
    	let img;
    	let img_src_value;
    	let t1;
    	let div1;
    	let h1;
    	let t2_value = /*titles*/ ctx[3]["title"] + "";
    	let t2;
    	let t3;
    	let h3;
    	let t4_value = /*titles*/ ctx[3]["release_year"] + "";
    	let t4;
    	let t5;
    	let p;
    	let t6_value = /*titles*/ ctx[3]["short_description"] + "";
    	let t6;
    	let t7;
    	let each_value = /*titles*/ ctx[3].offers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img = element("img");
    			t1 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			t2 = text(t2_value);
    			t3 = space();
    			h3 = element("h3");
    			t4 = text(t4_value);
    			t5 = space();
    			p = element("p");
    			t6 = text(t6_value);
    			t7 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(div0, "background-color", "transparent");
    			set_style(div0, "height", "15rem");
    			add_location(div0, file$1, 12, 4, 386);
    			if (!src_url_equal(img.src, img_src_value = /*titles*/ ctx[3]["poster_uri"])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Poster for the " + /*titles*/ ctx[3]['type'] + " " + /*titles*/ ctx[3]['title']);
    			attr_dev(img, "class", "svelte-1k9vcow");
    			add_location(img, file$1, 15, 8, 531);
    			add_location(h1, file$1, 20, 10, 687);
    			add_location(h3, file$1, 21, 10, 724);
    			add_location(p, file$1, 22, 10, 768);
    			attr_dev(div1, "class", "text svelte-1k9vcow");
    			add_location(div1, file$1, 19, 8, 658);
    			set_style(div2, "display", "flex");
    			set_style(div2, "align-items", "left");
    			add_location(div2, file$1, 14, 6, 476);
    			attr_dev(div3, "class", "box svelte-1k9vcow");
    			add_location(div3, file$1, 13, 4, 452);
    			attr_dev(div4, "class", "selection svelte-1k9vcow");
    			set_style(div4, "--backdrop-url", "url(" + /*titles*/ ctx[3].backdrop_url + ")");
    			add_location(div4, file$1, 11, 2, 306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(h1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, h3);
    			append_dev(h3, t4);
    			append_dev(div1, t5);
    			append_dev(div1, p);
    			append_dev(p, t6);
    			append_dev(div1, t7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) {
    				each_value = /*titles*/ ctx[3].offers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(11:0) {:then titles}",
    		ctx
    	});

    	return block;
    }

    // (27:14) {#each country.offers as offer}
    function create_each_block_1(ctx) {
    	let div;
    	let span;
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let label;
    	let t1_value = /*offer*/ ctx[7].clear_name + "";
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			if (!src_url_equal(img.src, img_src_value = /*offer*/ ctx[7]["icon_uri"])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Icon for " + /*offer*/ ctx[7].clear_name);
    			attr_dev(img, "id", /*offer*/ ctx[7].short_name);
    			attr_dev(img, "class", "svelte-1k9vcow");
    			add_location(img, file$1, 29, 45, 1144);
    			attr_dev(a, "href", /*offer*/ ctx[7]["url"]);
    			add_location(a, file$1, 29, 20, 1119);
    			attr_dev(label, "for", /*offer*/ ctx[7].short_name);
    			attr_dev(label, "class", "svelte-1k9vcow");
    			add_location(label, file$1, 30, 18, 1256);
    			set_style(span, "text-align", "center");
    			set_style(span, "display", "inline-block");
    			add_location(span, file$1, 28, 18, 1041);
    			set_style(div, "display", "inline-block");
    			add_location(div, file$1, 27, 16, 986);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, a);
    			append_dev(a, img);
    			append_dev(span, t0);
    			append_dev(span, label);
    			append_dev(label, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(27:14) {#each country.offers as offer}",
    		ctx
    	});

    	return block;
    }

    // (24:10) {#each titles.offers as country}
    function create_each_block(ctx) {
    	let div;
    	let h4;
    	let t0_value = /*country*/ ctx[4]["country"] + "";
    	let t0;
    	let t1;
    	let t2;
    	let each_value_1 = /*country*/ ctx[4].offers;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			add_location(h4, file$1, 25, 14, 894);
    			attr_dev(div, "class", "offer svelte-1k9vcow");
    			add_location(div, file$1, 24, 12, 860);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(div, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) {
    				each_value_1 = /*country*/ ctx[4].offers;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(24:10) {#each titles.offers as country}",
    		ctx
    	});

    	return block;
    }

    // (9:14)    <Loading/> {:then titles}
    function create_pending_block$1(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(9:14)    <Loading/> {:then titles}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 3,
    		blocks: [,,,]
    	};

    	handle_promise(/*title*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Selection', slots, []);
    	let { providers } = $$props;
    	let { selection } = $$props;
    	selection = JSON.parse(selection);
    	let title = get_all_info_from_id(selection, providers);
    	const writable_props = ['providers', 'selection'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Selection> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('providers' in $$props) $$invalidate(2, providers = $$props.providers);
    		if ('selection' in $$props) $$invalidate(1, selection = $$props.selection);
    	};

    	$$self.$capture_state = () => ({
    		Loading,
    		get_all_info_from_id,
    		providers,
    		selection,
    		title
    	});

    	$$self.$inject_state = $$props => {
    		if ('providers' in $$props) $$invalidate(2, providers = $$props.providers);
    		if ('selection' in $$props) $$invalidate(1, selection = $$props.selection);
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, selection, providers];
    }

    class Selection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { providers: 2, selection: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selection",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*providers*/ ctx[2] === undefined && !('providers' in props)) {
    			console.warn("<Selection> was created without expected prop 'providers'");
    		}

    		if (/*selection*/ ctx[1] === undefined && !('selection' in props)) {
    			console.warn("<Selection> was created without expected prop 'selection'");
    		}
    	}

    	get providers() {
    		throw new Error("<Selection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set providers(value) {
    		throw new Error("<Selection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selection() {
    		throw new Error("<Selection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selection(value) {
    		throw new Error("<Selection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.1 */

    // (1:0) <script lang="ts">import Search from "./Search.svelte"; import SearchResults from "./SearchResults.svelte"; import Selection from "./Selection.svelte"; import Loading from "./Loading.svelte"; import { distilled_providers }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import Search from \\\"./Search.svelte\\\"; import SearchResults from \\\"./SearchResults.svelte\\\"; import Selection from \\\"./Selection.svelte\\\"; import Loading from \\\"./Loading.svelte\\\"; import { distilled_providers }",
    		ctx
    	});

    	return block;
    }

    // (32:0) {:then providers}
    function create_then_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*page*/ ctx[0] == "search") return 0;
    		if (/*page*/ ctx[0] == "SearchResults") return 1;
    		if (/*page*/ ctx[0] == "Selection") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(32:0) {:then providers}",
    		ctx
    	});

    	return block;
    }

    // (37:32) 
    function create_if_block_2(ctx) {
    	let selection_1;
    	let current;

    	selection_1 = new Selection({
    			props: {
    				providers: /*providers*/ ctx[4],
    				selection: /*selection*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(selection_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(selection_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const selection_1_changes = {};
    			if (dirty & /*selection*/ 8) selection_1_changes.selection = /*selection*/ ctx[3];
    			selection_1.$set(selection_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selection_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selection_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selection_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(37:32) ",
    		ctx
    	});

    	return block;
    }

    // (35:36) 
    function create_if_block_1(ctx) {
    	let searchresults;
    	let current;

    	searchresults = new SearchResults({
    			props: {
    				query: "" + (/*search*/ ctx[1] + ","),
    				locale: /*locale*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(searchresults.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchresults, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const searchresults_changes = {};
    			if (dirty & /*search*/ 2) searchresults_changes.query = "" + (/*search*/ ctx[1] + ",");
    			if (dirty & /*locale*/ 4) searchresults_changes.locale = /*locale*/ ctx[2];
    			searchresults.$set(searchresults_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchresults.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchresults.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchresults, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(35:36) ",
    		ctx
    	});

    	return block;
    }

    // (33:2) {#if page == "search"}
    function create_if_block(ctx) {
    	let search_1;
    	let current;
    	search_1 = new Search({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(search_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(search_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(search_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(33:2) {#if page == \\\"search\\\"}",
    		ctx
    	});

    	return block;
    }

    // (30:18)    <Loading/> {:then providers}
    function create_pending_block(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(30:18)    <Loading/> {:then providers}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 4,
    		blocks: [,,,]
    	};

    	handle_promise(/*providers*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let providers = distilled_providers();
    	let { page = "search" } = $$props;
    	let { search = undefined } = $$props;
    	let { locale = undefined } = $$props;
    	let { selection = undefined } = $$props;
    	const writable_props = ['page', 'search', 'locale', 'selection'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('search' in $$props) $$invalidate(1, search = $$props.search);
    		if ('locale' in $$props) $$invalidate(2, locale = $$props.locale);
    		if ('selection' in $$props) $$invalidate(3, selection = $$props.selection);
    	};

    	$$self.$capture_state = () => ({
    		Search,
    		SearchResults,
    		Selection,
    		Loading,
    		distilled_providers,
    		providers,
    		page,
    		search,
    		locale,
    		selection
    	});

    	$$self.$inject_state = $$props => {
    		if ('providers' in $$props) $$invalidate(4, providers = $$props.providers);
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('search' in $$props) $$invalidate(1, search = $$props.search);
    		if ('locale' in $$props) $$invalidate(2, locale = $$props.locale);
    		if ('selection' in $$props) $$invalidate(3, selection = $$props.selection);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [page, search, locale, selection, providers];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			page: 0,
    			search: 1,
    			locale: 2,
    			selection: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get page() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get search() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set search(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get locale() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locale(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selection() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selection(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Index.svelte generated by Svelte v3.44.1 */
    const file = "src/Index.svelte";

    function create_fragment(ctx) {
    	let meta;
    	let html;
    	let t;
    	let main;
    	let app;
    	let current;
    	app = new App({ $$inline: true });

    	const block = {
    		c: function create() {
    			meta = element("meta");
    			html = element("html");
    			t = space();
    			main = element("main");
    			create_component(app.$$.fragment);
    			document.title = "Steaming Search";
    			attr_dev(meta, "name", "viewport");
    			attr_dev(meta, "content", "width=device-width, initial-scale=1.0");
    			add_location(meta, file, 6, 2, 102);
    			attr_dev(html, "lang", "en");
    			add_location(html, file, 7, 2, 177);
    			add_location(main, file, 10, 0, 212);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, meta);
    			append_dev(document.head, html);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(app, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(app.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(app.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(meta);
    			detach_dev(html);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
    			destroy_component(app);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Index', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Index> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ App });
    	return [];
    }

    class Index extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Index",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new Index({
        target: document.body,
        props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

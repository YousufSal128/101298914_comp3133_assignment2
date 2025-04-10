import {
  ApolloClient,
  NetworkStatus
} from "./chunk-V3YHE6QE.js";
import "./chunk-FCYMIMUI.js";
import {
  gql
} from "./chunk-JHISNTPZ.js";
import "./chunk-JIOZH66W.js";
import {
  Inject,
  Injectable,
  InjectionToken,
  NgModule,
  NgZone,
  Observable,
  Optional,
  from,
  map,
  observable,
  observeOn,
  queueScheduler,
  setClassMetadata,
  startWith,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-OM4ZUTHN.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-L3TH4L7L.js";

// node_modules/apollo-angular/fesm2020/ngApollo.mjs
function fromPromise(promiseFn) {
  return new Observable((subscriber) => {
    promiseFn().then((result) => {
      if (!subscriber.closed) {
        subscriber.next(result);
        subscriber.complete();
      }
    }, (error) => {
      if (!subscriber.closed) {
        subscriber.error(error);
      }
    });
    return () => subscriber.unsubscribe();
  });
}
function useMutationLoading(source, enabled) {
  if (!enabled) {
    return source.pipe(map((result) => __spreadProps(__spreadValues({}, result), {
      loading: false
    })));
  }
  return source.pipe(startWith({
    loading: true
  }), map((result) => __spreadProps(__spreadValues({}, result), {
    loading: !!result.loading
  })));
}
var ZoneScheduler = class {
  constructor(zone) {
    this.zone = zone;
    this.now = Date.now ? Date.now : () => +/* @__PURE__ */ new Date();
  }
  schedule(work, delay = 0, state) {
    return this.zone.run(() => queueScheduler.schedule(work, delay, state));
  }
};
function fixObservable(obs) {
  obs[observable] = () => obs;
  return obs;
}
function wrapWithZone(obs, ngZone) {
  return obs.pipe(observeOn(new ZoneScheduler(ngZone)));
}
function pickFlag(flags, flag, defaultValue) {
  return flags && typeof flags[flag] !== "undefined" ? flags[flag] : defaultValue;
}
function useInitialLoading(obsQuery) {
  return function useInitialLoadingOperator(source) {
    return new Observable(function useInitialLoadingSubscription(subscriber) {
      const currentResult = obsQuery.getCurrentResult();
      const {
        loading,
        errors,
        error,
        partial,
        data
      } = currentResult;
      const {
        partialRefetch,
        fetchPolicy
      } = obsQuery.options;
      const hasError = errors || error;
      if (partialRefetch && partial && (!data || Object.keys(data).length === 0) && fetchPolicy !== "cache-only" && !loading && !hasError) {
        subscriber.next(__spreadProps(__spreadValues({}, currentResult), {
          loading: true,
          networkStatus: NetworkStatus.loading
        }));
      }
      return source.subscribe(subscriber);
    });
  };
}
var QueryRef = class {
  constructor(obsQuery, ngZone, options) {
    this.obsQuery = obsQuery;
    const wrapped = wrapWithZone(from(fixObservable(this.obsQuery)), ngZone);
    this.valueChanges = options.useInitialLoading ? wrapped.pipe(useInitialLoading(this.obsQuery)) : wrapped;
    this.queryId = this.obsQuery.queryId;
  }
  // ObservableQuery's methods
  get options() {
    return this.obsQuery.options;
  }
  get variables() {
    return this.obsQuery.variables;
  }
  result() {
    return this.obsQuery.result();
  }
  getCurrentResult() {
    return this.obsQuery.getCurrentResult();
  }
  getLastResult() {
    return this.obsQuery.getLastResult();
  }
  getLastError() {
    return this.obsQuery.getLastError();
  }
  resetLastResults() {
    return this.obsQuery.resetLastResults();
  }
  refetch(variables) {
    return this.obsQuery.refetch(variables);
  }
  fetchMore(fetchMoreOptions) {
    return this.obsQuery.fetchMore(fetchMoreOptions);
  }
  subscribeToMore(options) {
    return this.obsQuery.subscribeToMore(options);
  }
  updateQuery(mapFn) {
    return this.obsQuery.updateQuery(mapFn);
  }
  stopPolling() {
    return this.obsQuery.stopPolling();
  }
  startPolling(pollInterval) {
    return this.obsQuery.startPolling(pollInterval);
  }
  setOptions(opts) {
    return this.obsQuery.setOptions(opts);
  }
  setVariables(variables) {
    return this.obsQuery.setVariables(variables);
  }
};
var APOLLO_FLAGS = new InjectionToken("APOLLO_FLAGS");
var APOLLO_OPTIONS = new InjectionToken("APOLLO_OPTIONS");
var APOLLO_NAMED_OPTIONS = new InjectionToken("APOLLO_NAMED_OPTIONS");
var ApolloBase = class {
  constructor(ngZone, flags, _client) {
    this.ngZone = ngZone;
    this.flags = flags;
    this._client = _client;
    this.useInitialLoading = pickFlag(flags, "useInitialLoading", false);
    this.useMutationLoading = pickFlag(flags, "useMutationLoading", false);
  }
  watchQuery(options) {
    return new QueryRef(this.ensureClient().watchQuery(__spreadValues({}, options)), this.ngZone, __spreadValues({
      useInitialLoading: this.useInitialLoading
    }, options));
  }
  query(options) {
    return fromPromise(() => this.ensureClient().query(__spreadValues({}, options)));
  }
  mutate(options) {
    return useMutationLoading(fromPromise(() => this.ensureClient().mutate(__spreadValues({}, options))), options.useMutationLoading ?? this.useMutationLoading);
  }
  subscribe(options, extra) {
    const obs = from(fixObservable(this.ensureClient().subscribe(__spreadValues({}, options))));
    return extra && extra.useZone !== true ? obs : wrapWithZone(obs, this.ngZone);
  }
  /**
   * Get an instance of ApolloClient
   * @deprecated use `apollo.client` instead
   */
  getClient() {
    return this.client;
  }
  /**
   * Set a new instance of ApolloClient
   * Remember to clean up the store before setting a new client.
   * @deprecated use `apollo.client = client` instead
   *
   * @param client ApolloClient instance
   */
  setClient(client) {
    this.client = client;
  }
  /**
   * Get an instance of ApolloClient
   */
  get client() {
    return this._client;
  }
  /**
   * Set a new instance of ApolloClient
   * Remember to clean up the store before setting a new client.
   *
   * @param client ApolloClient instance
   */
  set client(client) {
    if (this._client) {
      throw new Error("Client has been already defined");
    }
    this._client = client;
  }
  ensureClient() {
    this.checkInstance();
    return this._client;
  }
  checkInstance() {
    if (!this._client) {
      throw new Error("Client has not been defined yet");
    }
  }
};
var Apollo = class extends ApolloBase {
  constructor(_ngZone, apolloOptions, apolloNamedOptions, flags) {
    super(_ngZone, flags);
    this._ngZone = _ngZone;
    this.map = /* @__PURE__ */ new Map();
    if (apolloOptions) {
      this.createDefault(apolloOptions);
    }
    if (apolloNamedOptions && typeof apolloNamedOptions === "object") {
      for (let name in apolloNamedOptions) {
        if (apolloNamedOptions.hasOwnProperty(name)) {
          const options = apolloNamedOptions[name];
          this.create(options, name);
        }
      }
    }
  }
  /**
   * Create an instance of ApolloClient
   * @param options Options required to create ApolloClient
   * @param name client's name
   */
  create(options, name) {
    if (isDefault(name)) {
      this.createDefault(options);
    } else {
      this.createNamed(name, options);
    }
  }
  /**
   * Use a default ApolloClient
   */
  default() {
    return this;
  }
  /**
   * Use a named ApolloClient
   * @param name client's name
   */
  use(name) {
    if (isDefault(name)) {
      return this.default();
    }
    return this.map.get(name);
  }
  /**
   * Create a default ApolloClient, same as `apollo.create(options)`
   * @param options ApolloClient's options
   */
  createDefault(options) {
    if (this.getClient()) {
      throw new Error("Apollo has been already created.");
    }
    return this.setClient(new ApolloClient(options));
  }
  /**
   * Create a named ApolloClient, same as `apollo.create(options, name)`
   * @param name client's name
   * @param options ApolloClient's options
   */
  createNamed(name, options) {
    if (this.map.has(name)) {
      throw new Error(`Client ${name} has been already created`);
    }
    this.map.set(name, new ApolloBase(this._ngZone, this.flags, new ApolloClient(options)));
  }
  /**
   * Remember to clean up the store before removing a client
   * @param name client's name
   */
  removeClient(name) {
    if (isDefault(name)) {
      this._client = void 0;
    } else {
      this.map.delete(name);
    }
  }
};
Apollo.ɵfac = function Apollo_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || Apollo)(ɵɵinject(NgZone), ɵɵinject(APOLLO_OPTIONS, 8), ɵɵinject(APOLLO_NAMED_OPTIONS, 8), ɵɵinject(APOLLO_FLAGS, 8));
};
Apollo.ɵprov = ɵɵdefineInjectable({
  token: Apollo,
  factory: Apollo.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Apollo, [{
    type: Injectable
  }], function() {
    return [{
      type: NgZone
    }, {
      type: void 0,
      decorators: [{
        type: Optional
      }, {
        type: Inject,
        args: [APOLLO_OPTIONS]
      }]
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [APOLLO_NAMED_OPTIONS]
      }, {
        type: Optional
      }]
    }, {
      type: void 0,
      decorators: [{
        type: Inject,
        args: [APOLLO_FLAGS]
      }, {
        type: Optional
      }]
    }];
  }, null);
})();
function isDefault(name) {
  return !name || name === "default";
}
var PROVIDERS = [Apollo];
var ApolloModule = class {
};
ApolloModule.ɵfac = function ApolloModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || ApolloModule)();
};
ApolloModule.ɵmod = ɵɵdefineNgModule({
  type: ApolloModule
});
ApolloModule.ɵinj = ɵɵdefineInjector({
  providers: PROVIDERS
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApolloModule, [{
    type: NgModule,
    args: [{
      providers: PROVIDERS
    }]
  }], null, null);
})();
var Query = class {
  constructor(apollo) {
    this.apollo = apollo;
    this.client = "default";
  }
  watch(variables, options) {
    return this.apollo.use(this.client).watchQuery(__spreadProps(__spreadValues({}, options), {
      variables,
      query: this.document
    }));
  }
  fetch(variables, options) {
    return this.apollo.use(this.client).query(__spreadProps(__spreadValues({}, options), {
      variables,
      query: this.document
    }));
  }
};
Query.ɵfac = function Query_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || Query)(ɵɵinject(Apollo));
};
Query.ɵprov = ɵɵdefineInjectable({
  token: Query,
  factory: Query.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Query, [{
    type: Injectable
  }], function() {
    return [{
      type: Apollo
    }];
  }, null);
})();
var Mutation = class {
  constructor(apollo) {
    this.apollo = apollo;
    this.client = "default";
  }
  mutate(variables, options) {
    return this.apollo.use(this.client).mutate(__spreadProps(__spreadValues({}, options), {
      variables,
      mutation: this.document
    }));
  }
};
Mutation.ɵfac = function Mutation_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || Mutation)(ɵɵinject(Apollo));
};
Mutation.ɵprov = ɵɵdefineInjectable({
  token: Mutation,
  factory: Mutation.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Mutation, [{
    type: Injectable
  }], function() {
    return [{
      type: Apollo
    }];
  }, null);
})();
var Subscription = class {
  constructor(apollo) {
    this.apollo = apollo;
    this.client = "default";
  }
  subscribe(variables, options, extra) {
    return this.apollo.use(this.client).subscribe(__spreadProps(__spreadValues({}, options), {
      variables,
      query: this.document
    }), extra);
  }
};
Subscription.ɵfac = function Subscription_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || Subscription)(ɵɵinject(Apollo));
};
Subscription.ɵprov = ɵɵdefineInjectable({
  token: Subscription,
  factory: Subscription.ɵfac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Subscription, [{
    type: Injectable
  }], function() {
    return [{
      type: Apollo
    }];
  }, null);
})();
function typedGQLTag(literals, ...placeholders) {
  return gql(literals, ...placeholders);
}
var gql2 = typedGQLTag;
var graphql = typedGQLTag;
export {
  APOLLO_FLAGS,
  APOLLO_NAMED_OPTIONS,
  APOLLO_OPTIONS,
  Apollo,
  ApolloBase,
  ApolloModule,
  Mutation,
  Query,
  QueryRef,
  Subscription,
  gql2 as gql,
  graphql
};
//# sourceMappingURL=apollo-angular.js.map

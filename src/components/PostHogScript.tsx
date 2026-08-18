import Script from "next/script";

/**
 * The PostHog snippet, verbatim from the project's own settings page.
 *
 * Kept as the official snippet rather than the npm package on
 * purpose. It installs a stub on `window.posthog` immediately and
 * queues any calls made before the real library finishes loading, so
 * an event fired early is held rather than lost - and every call site
 * can reach it without threading a provider through the tree.
 *
 * `afterInteractive` runs it once the page is usable, so analytics
 * never competes with first paint. `person_profiles: "always"` creates
 * profiles for anonymous visitors too, not only identified ones.
 */

const PROJECT_KEY = "phc_u6qpQ6SvcgUM7aoj62ZAVWFk35bCZdkYmWqAvHdjFR29";
const API_HOST = "https://us.i.posthog.com";

/* The key is not a secret: PostHog project keys are write-only, and
   this ships inside the page either way. */
const SNIPPET = `
!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="Sn Cn init Hn Un Gn Yi zn Kn qn capture Vn kn calculateEventProperties es register register_once register_for_session unregister unregister_for_session os Bn ss getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync ls identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset us shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty rs Xn createPersonProfile setInternalOrTestUser ns $n vs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Jn debug tr At getPageViewId captureTraceFeedback captureTraceMetric Ln".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('${PROJECT_KEY}', {
  api_host: '${API_HOST}',
  defaults: '2026-05-30',
  person_profiles: 'always'
})
`;

export default function PostHogScript() {
  return (
    <Script
      id="posthog"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: SNIPPET }}
    />
  );
}

/**
 * Transport host seam for ProcedureRecord SharePoint REST List Items.
 *
 * This slice does not bind SPFx SPHttpClient and does not authorize live tenant I/O.
 */

export type SpfxSpHttpClientHostSeam = Readonly<{
  kind: "spfx-sphttpclient-when-available";
  bindWhenAvailable: false;
  liveTenantIoAuthorized: false;
}>;

export const SPFX_SPHTTPCLIENT_HOST_SEAM: SpfxSpHttpClientHostSeam = {
  kind: "spfx-sphttpclient-when-available",
  bindWhenAvailable: false,
  liveTenantIoAuthorized: false,
};

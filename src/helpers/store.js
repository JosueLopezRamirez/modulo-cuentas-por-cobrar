import { create } from "zustand";
import { persist } from "zustand/middleware";
import { get, post } from "./axiosClient";

const defaultState = {
  loading: false,
  hasErrors: false,
  usuario: null,
  empresaSeleccionada: null,
  token: null,
  roles: [],
  empresas: [],
  featureFlags: [],
  featuresFlagsByUser: [],
};

const useStore = create(
  persist(
    (set, getState) => ({
      ...defaultState,
      logout: () =>
        set(() => ({
          ...defaultState,
        })),
      updateEmpresaSeleccionada: (empresaSeleccionada) => {
        set(() => ({ empresaSeleccionada }));
      },
      login: async ({ email, password }) => {
        set(() => ({ loading: true }));
        try {
          const { usuario, access_token } = await post("/autenticacion/login", {
            correo: email,
            password,
          });
          set(() => ({ usuario, token: access_token, loading: false }));
          return access_token;
        } catch (err) {
          set(() => ({ hasErrors: true, loading: false }));
          return null;
        }
      },
      getFeaturesFlagsByUser: async () => {
        const usuario = getState().usuario;
        console.log({ usuario });
        set(() => ({ loading: true }));
        try {
          const featuresFlagsByUser = await get(
            `/feature-flag-user/${usuario.id}`
          );
          set(() => ({ featuresFlagsByUser, loading: false }));
        } catch (err) {
          set(() => ({ hasErrors: true, loading: false }));
        }
      },
      getFeaturesFlags: async () => {
        set(() => ({ loading: true }));
        try {
          const featureFlags = await get("/feature-flag");
          set(() => ({ featureFlags, loading: false }));
        } catch (err) {
          console.log(err);
          set(() => ({ hasErrors: true, loading: false }));
        }
      },
      getEmpresas: async () => {
        set(() => ({ loading: true }));
        try {
          const { data } = await get("/empresas");
          set(() => ({ empresas: data, loading: false }));
        } catch (err) {
          set(() => ({ hasErrors: true, loading: false }));
        }
      },
      getRoles: async () => {
        set(() => ({ loading: true }));
        try {
          const roles = await get("/roles");
          console.log({ roles });
          set(() => ({ roles, loading: false }));
        } catch (err) {
          set(() => ({ hasErrors: true, loading: false }));
        }
      },
    }),
    { name: "store" }
  )
);

export default useStore;

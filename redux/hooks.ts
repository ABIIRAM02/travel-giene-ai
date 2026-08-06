
import { useStore, useDispatch, useSelector } from "react-redux";

import type { AppDispatch, AppSelector, AppStore } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<AppSelector>();

export const useAppStore = useStore.withTypes<AppStore>();
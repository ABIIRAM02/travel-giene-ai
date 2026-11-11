import { CreditCard, Gem, HeartPlus, LayoutDashboard, Mountain, Parasol, Plane, RockingChair, Sparkles, Store, TreePine, UserRoundPen } from "lucide-react";

export const authRoute = ["/login", "/register"];

export const SIDE_BAR_OPTIONS = [
    {
        icon: LayoutDashboard,
        name:'Dashboard'
    },
    {
        icon: Plane,
        name:'My Trips'
    },
    {
        icon: Sparkles,
        name:'AI Planner'
    },
    {
        icon: HeartPlus,
        name:'Favourites'
    },
    {
        icon: CreditCard,
        name:'Billing'
    },
    {
        icon: UserRoundPen,
        name:'Profile'
    },
]

export const PLANNER_FORM_INPUTS = [
    {
        icon:'L',
        label:'destination',
        name:'destination',
        type:'text'
    },
    {
        icon:'L',
        label:'days',
        name:'days',
        type:'number'
    },
]

export const TRAVEL_STYLE = [
    {
        icon: Mountain,
        label:'Adventure',
        selected: false
    },
    {
        icon: TreePine,
        label:'Nature',
        selected: false
    },
    {
        icon: Gem,
        label:'Luxury',
        selected: false
    },
    {
        icon: RockingChair,
        label:'Relaxed',
        selected: false
    },
    {
        icon: Store,
        label:'Culture',
        selected: false
    },
    {
        icon: Parasol,
        label:'Beaches',
        selected: false
    },
]

export const TRAVEL_GROUPS = ["Solo", "Couple", "Family", "Friends"];
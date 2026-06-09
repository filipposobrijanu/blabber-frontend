import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

export interface Language {
  code: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: Date;
  image?: string;
}

export interface ShopContextType {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  menu: string;
  setMenu: (menu: string) => void;
  selectedChannel: string;
  setSelectedChannel: (channel: string) => void;
  selectedChannelImage: string;
  setSelectedChannelImage: (image: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  activeMainBut: boolean;
  setActiveMainBut: (active: boolean) => void;
  currentChannel: any | null;
  setCurrentChannel: (channel: any | null) => void;
  messages: any[];
  setMessages: (messages: any[] | ((prev: any[]) => any[])) => void;
  channels: any[];
  setChannels: (channels: any[] | ((prev: any[]) => any[])) => void;
  onlineUsers: User[];
  setOnlineUsers: (users: User[]) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

export const ShopContext = createContext<ShopContextType | null>(null);

interface ShopContextProviderProps {
  children: ReactNode;
}

const LANGUAGES: Language[] = [
  { code: "us", name: "English" },
  { code: "gr", name: "Greek" },
  { code: "ru", name: "Russian" },
  { code: "md", name: "Română" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
];

const ShopContextProvider: React.FC<ShopContextProviderProps> = React.memo(
  (props) => {
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
      const savedLang = localStorage.getItem("selectedLanguage");
      return savedLang ? JSON.parse(savedLang) : LANGUAGES[0];
    });

    const [menu, setMenu] = useState<string>(() => {
      return localStorage.getItem("menu") || "home";
    });

    const [selectedChannel, setSelectedChannel] = useState<any | null>(
      "friends",
    );
    const [selectedChannelImage, setSelectedChannelImage] =
      useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [activeMainBut, setActiveMainBut] = useState(true);
    const [pageTitle, setPageTitle] = useState("Blabber - Login");

    const [currentChannel, setCurrentChannel] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [channels, setChannels] = useState<any[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

    const detectUserLanguage = useCallback(async () => {
      try {
        const response = await fetch(
          "https://api.geoapify.com/v1/ipinfo?&apiKey=754c58382b374503b231cc3b96910862",
        );

        if (!response.ok) return;

        const ipData = await response.json();
        const countryCode = ipData.country?.iso_code?.toLowerCase();

        console.log("Detected country:", countryCode);

        const countryToLanguage: Record<string, string> = {
          gr: "gr",
          ru: "ru",
          md: "md",
          ro: "md",
          es: "es",
          fr: "fr",
          de: "de",
          at: "de",
          ch: "de",
          E,
        };

        const detectedLanguageCode = countryToLanguage[countryCode];

        if (detectedLanguageCode) {
          const detectedLanguage = LANGUAGES.find(
            (lang) => lang.code === detectedLanguageCode,
          );
          if (detectedLanguage) {
            setSelectedLanguage(detectedLanguage);
            console.log("Auto-detected language:", detectedLanguage.name);
          }
        }
      } catch (error) {
        console.error("IP detection error:", error);
      }
    }, []);

    useEffect(() => {
      const savedLang = localStorage.getItem("selectedLanguage");
      if (!savedLang) {
        detectUserLanguage();
      }
    }, [detectUserLanguage]);

    const memoizedSetSelectedLanguage = useCallback((language: Language) => {
      setSelectedLanguage(language);
    }, []);

    const memoizedSetMenu = useCallback((menu: string) => {
      setMenu(menu);
    }, []);

    const memoizedSetSelectedChannel = useCallback((channel: string) => {
      setSelectedChannel(channel);
    }, []);

    const memoizedSetSelectedChannelImage = useCallback((image: string) => {
      setSelectedChannelImage(image);
    }, []);

    const memoizedSetUser = useCallback((user: User | null) => {
      setUser(user);
    }, []);

    const memoizedSetActiveMainBut = useCallback((active: boolean) => {
      setActiveMainBut(active);
    }, []);

    const memoizedSetCurrentChannel = useCallback((channel: any | null) => {
      setCurrentChannel(channel);
    }, []);

    const memoizedSetMessages = useCallback(
      (messages: any[] | ((prev: any[]) => any[])) => {
        setMessages(messages);
      },
      [],
    );

    const memoizedSetChannels = useCallback(
      (channels: any[] | ((prev: any[]) => any[])) => {
        setChannels(channels);
      },
      [],
    );

    const memoizedSetOnlineUsers = useCallback((users: User[]) => {
      setOnlineUsers(users);
    }, []);

    const memoizedSetPageTitle = useCallback((title: string) => {
      setPageTitle(title);
    }, []);

    useEffect(() => {
      if (selectedLanguage) {
        localStorage.setItem(
          "selectedLanguage",
          JSON.stringify(selectedLanguage),
        );
      }
    }, [selectedLanguage]);
    useEffect(() => {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };

      document.addEventListener("contextmenu", handleContextMenu);

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
      };
    }, []);
    useEffect(() => {
      if (menu) {
        localStorage.setItem("menu", menu);
      }
    }, [menu]);

    const contextValue: ShopContextType = useMemo(
      () => ({
        menu,
        setMenu: memoizedSetMenu,
        selectedLanguage,
        setSelectedLanguage: memoizedSetSelectedLanguage,
        selectedChannel,
        setSelectedChannel: memoizedSetSelectedChannel,
        selectedChannelImage,
        setSelectedChannelImage: memoizedSetSelectedChannelImage,
        user,
        setUser: memoizedSetUser,
        activeMainBut,
        setActiveMainBut: memoizedSetActiveMainBut,
        currentChannel,
        setCurrentChannel: memoizedSetCurrentChannel,
        messages,
        setMessages: memoizedSetMessages,
        channels,
        setChannels: memoizedSetChannels,
        onlineUsers,
        setOnlineUsers: memoizedSetOnlineUsers,
        pageTitle,
        setPageTitle: memoizedSetPageTitle,
      }),
      [
        menu,
        selectedLanguage,
        selectedChannel,
        selectedChannelImage,
        user,
        activeMainBut,
        currentChannel,
        messages,
        channels,
        onlineUsers,
        pageTitle,
        memoizedSetMenu,
        memoizedSetSelectedLanguage,
        memoizedSetSelectedChannel,
        memoizedSetSelectedChannelImage,
        memoizedSetUser,
        memoizedSetActiveMainBut,
        memoizedSetCurrentChannel,
        memoizedSetMessages,
        memoizedSetChannels,
        memoizedSetOnlineUsers,
        memoizedSetPageTitle,
      ],
    );

    return (
      <ShopContext.Provider value={contextValue}>
        {props.children}
      </ShopContext.Provider>
    );
  },
);

export const useShopContext = () => {
  const context = React.useContext(ShopContext);

  if (!context) {
    throw new Error("useShopContext must be used within ShopContextProvider");
  }
  return context;
};

export default ShopContextProvider;

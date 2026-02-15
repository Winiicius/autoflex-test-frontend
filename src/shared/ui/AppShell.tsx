import {
    Avatar,
    Box,
    Flex,
    HStack,
    Icon,
    IconButton,
    Text,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { NavLink, Outlet } from "react-router-dom";
import { FiBox, FiHome, FiLogOut, FiPackage } from "react-icons/fi";
import { useAuth } from "../../features/auth/AuthContext";

type NavItemProps = {
    to: string;
    icon: any;
    label: string;
};

function NavItem({ to, icon, label }: NavItemProps) {
    const activeBg = useColorModeValue("brand.50", "whiteAlpha.100");
    const activeColor = useColorModeValue("brand.700", "brand.200");
    const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100");

    return (
        <NavLink to={to} style={{ width: "100%" }}>
            {({ isActive }) => (
                <HStack
                    w="100%"
                    px={3}
                    py={2}
                    borderRadius="8px"
                    bg={isActive ? activeBg : "transparent"}
                    color={isActive ? activeColor : "gray.700"}
                    _hover={{ bg: hoverBg }}
                    spacing={3}
                >
                    <Icon as={icon} boxSize={5} />
                    <Text fontSize="sm" fontWeight={isActive ? "semibold" : "medium"}>
                        {label}
                    </Text>
                </HStack>
            )}
        </NavLink>
    );
}

export function AppShell() {
    const { user, logout } = useAuth();

    const border = useColorModeValue("gray.200", "whiteAlpha.200");
    const sidebarBg = useColorModeValue("white", "gray.900");
    const contentBg = useColorModeValue("gray.50", "gray.800");

    return (
        <Flex minH="100vh" bg={contentBg}>
            {/* Sidebar */}
            <Box
                w="260px"
                bg={sidebarBg}
                borderRightWidth="1px"
                borderRightColor={border}
                p={4}
                position="sticky"
                top={0}
                h="100vh"
            >
                <VStack align="stretch" spacing={4} h="100%">
                    <Box>
                        <Text fontSize="sm" color="gray.500">
                            Autoflex
                        </Text>
                        <Text fontSize="lg" fontWeight="bold">
                            Inventory
                        </Text>
                    </Box>

                    <VStack align="stretch" spacing={1}>
                        <NavItem to="/" icon={FiHome} label="Dashboard" />
                        <NavItem to="/products" icon={FiBox} label="Products" />
                        <NavItem to="/raw-materials" icon={FiPackage} label="Raw Materials" />
                        <NavItem to="/production" icon={FiPackage} label="Production Capacity" />
                    </VStack>

                    <Box flex="1" />

                    {/* User + logout */}
                    <HStack justify="space-between" pt={3} borderTopWidth="1px" borderTopColor={border}>
                        <HStack spacing={3}>
                            <Avatar size="sm" name={user?.name ?? "User"} />
                            <Box>
                                <Text fontSize="sm" fontWeight="semibold" noOfLines={1}>
                                    {user?.name ?? "User"}
                                </Text>
                                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                    {user?.email ?? ""}
                                </Text>
                            </Box>
                        </HStack>

                        <IconButton
                            aria-label="Logout"
                            icon={<Icon as={FiLogOut} />}
                            size="sm"
                            variant="ghost"
                            onClick={logout}
                        />
                    </HStack>
                </VStack>
            </Box>

            {/* Content */}
            <Box flex="1" p={6}>
                <Outlet />
            </Box>
        </Flex>
    );
}

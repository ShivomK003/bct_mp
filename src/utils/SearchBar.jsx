import { Search2Icon } from '@chakra-ui/icons'
import { Input, InputGroup, InputLeftElement, InputRightElement, Button } from '@chakra-ui/react'

function SearchBar() {

    return (
        <div className="w-[50%]">
            <InputGroup>
                <InputLeftElement pointerEvents='none' pl="4" pt='3'>
                    <Search2Icon color='black' />
                </InputLeftElement>
                <Input 
                type="text" 
                placeholder="Search for jobs.."
                fontSize={"xl"}
                bgColor={"white"}
                textColor={"black"}
                p="6"
                pl="8"
                ml="3"
                />
                <InputRightElement width="7rem">
                    <Button
                        size='md'
                        width="full"
                        colorScheme="blue"
                        h="3.15rem"
                        mt="2.5"
                    >
                        Search
                    </Button>
                </InputRightElement>
            </InputGroup>
            
        </div> 
    );
}

export default SearchBar;

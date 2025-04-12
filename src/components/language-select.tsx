import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { languages } from '@/config/languages';
import { cn } from '@/lib/utils';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useState } from '@wordpress/element';
import { Languages } from 'lucide-react';
import { Button } from './ui/button';

export default function LanguageSelector() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('en-US');
	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between gap-2"
				>
					<Languages size={16} />
					{value &&
						languages.find((lang) => lang.code === value)?.name}
					<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandList>
						<CommandGroup>
							{languages.map((lang) => (
								<CommandItem
									key={lang.code}
									value={lang.code}
									onSelect={(currentValue) => {
										setValue(
											currentValue === value
												? ''
												: currentValue
										);
										setOpen(false);
									}}
								>
									{value === lang.code
										? lang.native
										: lang.name}
									<CheckIcon
										className={cn(
											'ml-auto h-4 w-4',
											value === lang.code
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
